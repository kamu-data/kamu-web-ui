import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { DatasetService } from "./dataset.service";
import { NavigationEnd, Router } from "@angular/router";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter, first, switchMap, tap } from "rxjs/operators";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import ProjectLinks from "../project-links";
import { DatasetInfo } from "../interface/navigation.interface";
import { promiseWithCatch } from "../common/app.helpers";
import { BaseProcessingComponent } from "../common/base.processing.component";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { MaybeNull, MaybeUndefined } from "../common/app.types";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { DatasetPermissionsService } from "./dataset.permissions.service";
import { Observable, ReplaySubject, Subject, of } from "rxjs";
import { LineageGraphNodeData, LineageGraphNodeKind } from "./additional-components/lineage-component/lineage-model";
import _ from "lodash";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent extends BaseProcessingComponent implements OnInit, OnDestroy {
    public datasetBasics: MaybeUndefined<DatasetBasicsFragment>;
    public datasetPermissions$: Observable<DatasetPermissionsFragment>;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.Overview;
    public readonly DatasetViewTypeEnum = DatasetViewTypeEnum;

    private mainDatasetQueryComplete$: Subject<DatasetInfo> = new ReplaySubject<DatasetInfo>(1 /* bufferSize */);

    constructor(
        private datasetService: DatasetService,
        private datasetPermissionsServices: DatasetPermissionsService,
        private datasetSubsServices: DatasetSubscriptionsService,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public ngOnInit(): void {
        const urlDatasetInfo = this.getDatasetInfoFromUrl();
        this.initDatasetViewByType(urlDatasetInfo, this.getCurrentPageFromUrl());
        this.requestMainData(urlDatasetInfo);

        this.trackSubscriptions(
            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                this.initDatasetViewByType(this.getDatasetInfoFromUrl(), this.getCurrentPageFromUrl());
                this.requestMainDataIfChanged();
            }),
            this.datasetService.datasetChanges.subscribe((basics: DatasetBasicsFragment) => {
                this.datasetBasics = basics;
                this.cdr.markForCheck();
            }),
        );

        this.datasetPermissions$ = this.datasetSubsServices.permissionsChanges;
    }

    private requestMainDataIfChanged(): void {
        const urlDatasetInfo = this.getDatasetInfoFromUrl();
        if (
            _.isNil(this.datasetBasics) ||
            this.datasetBasics.name !== urlDatasetInfo.datasetName ||
            this.datasetBasics.owner.accountName !== urlDatasetInfo.accountName
        ) {
            this.requestMainData(urlDatasetInfo);
        }
    }

    public requestMainData(datasetInfo: DatasetInfo): void {
        this.trackSubscription(
            this.datasetService
                .requestDatasetMainData(datasetInfo)
                .pipe(
                    tap(() => {
                        this.mainDatasetQueryComplete$.next(datasetInfo);
                    }),
                )
                .subscribe(),
        );
    }

    public onPageChange(currentPage: number): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: this.datasetBasics.owner.accountName,
                datasetName: this.datasetBasics.name,
                tab: this.datasetViewType,
                page: currentPage,
            });
            this.initDatasetViewByType(
                {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
                currentPage,
            );
        }
    }

    private initOverviewTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.Overview;
    }

    private initDataTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.Data;
    }

    private initMetadataTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.Metadata;
    }

    private initHistoryTab(datasetInfo: DatasetInfo, currentPage: number): void {
        this.datasetViewType = DatasetViewTypeEnum.History;

        this.trackSubscription(
            this.mainDatasetQueryComplete$
                .pipe(
                    filter(
                        (info: DatasetInfo) =>
                            info.accountName === datasetInfo.accountName &&
                            info.datasetName === datasetInfo.datasetName,
                    ),
                    first(),
                    switchMap((info: DatasetInfo) => {
                        if (this.datasetViewType === DatasetViewTypeEnum.History) {
                            return this.datasetService.requestDatasetHistory(info, 20, currentPage - 1);
                        } else {
                            return of();
                        }
                    }),
                )
                .subscribe(),
        );
    }

    private initLineageTab(datasetInfo: DatasetInfo): void {
        this.datasetViewType = DatasetViewTypeEnum.Lineage;

        this.trackSubscription(
            this.mainDatasetQueryComplete$
                .pipe(
                    filter(
                        (info: DatasetInfo) =>
                            info.accountName === datasetInfo.accountName &&
                            info.datasetName === datasetInfo.datasetName,
                    ),
                    first(),
                    switchMap((info) => {
                        if (this.datasetViewType === DatasetViewTypeEnum.Lineage) {
                            return this.datasetService.requestDatasetLineage(info);
                        } else {
                            return of();
                        }
                    }),
                )
                .subscribe(),
        );
    }

    public initDiscussionsTab(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public initSettingsTab(datasetInfo: DatasetInfo): void {
        this.trackSubscription(
            this.mainDatasetQueryComplete$
                .pipe(
                    filter(
                        (info: DatasetInfo) =>
                            info.accountName === datasetInfo.accountName &&
                            info.datasetName === datasetInfo.datasetName,
                    ),
                    first(),
                    switchMap(() => this.datasetPermissions$.pipe(first())),
                )
                .subscribe((datasetPermissions: DatasetPermissionsFragment) => {
                    if (this.datasetPermissionsServices.shouldAllowSettingsTab(datasetPermissions)) {
                        this.datasetViewType = DatasetViewTypeEnum.Settings;
                    } else {
                        this.datasetViewType = DatasetViewTypeEnum.Overview;
                    }
                    this.cdr.detectChanges();
                }),
        );
    }

    public selectTopic(topicName: string): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
                title: topicName,
            }),
        );
    }

    public onClickLineageNode(node: Node): void {
        const nodeData: LineageGraphNodeData = node.data as LineageGraphNodeData;
        if (nodeData.kind === LineageGraphNodeKind.Dataset) {
            this.onSelectDataset(nodeData.dataObject.accountName, nodeData.dataObject.name);
        } else {
            throw new Error("Clicked lineage node of unexpected type");
        }
    }

    private initDatasetViewByType(datasetInfo: DatasetInfo, currentPage: number): void {
        const mapperTabs: { [key in DatasetViewTypeEnum]: () => void } = {
            [DatasetViewTypeEnum.Overview]: () => this.initOverviewTab(),
            [DatasetViewTypeEnum.Data]: () => this.initDataTab(),
            [DatasetViewTypeEnum.Metadata]: () => this.initMetadataTab(),
            [DatasetViewTypeEnum.History]: () => this.initHistoryTab(datasetInfo, currentPage),
            [DatasetViewTypeEnum.Lineage]: () => this.initLineageTab(datasetInfo),
            [DatasetViewTypeEnum.Discussions]: () => this.initDiscussionsTab(),
            [DatasetViewTypeEnum.Settings]: () => this.initSettingsTab(datasetInfo),
        };

        this.datasetViewType = this.getDatasetViewTypeFromUrl();
        mapperTabs[this.datasetViewType]();
    }

    private getCurrentPageFromUrl(): number {
        const page: MaybeNull<string> = this.activatedRoute.snapshot.queryParamMap.get(
            ProjectLinks.URL_QUERY_PARAM_PAGE,
        );
        return page ? Number(page) : 1;
    }

    private getDatasetViewTypeFromUrl(): DatasetViewTypeEnum {
        const tabValue: MaybeNull<string> = this.activatedRoute.snapshot.queryParamMap.get(
            ProjectLinks.URL_QUERY_PARAM_TAB,
        );
        if (tabValue) {
            const tab = tabValue as DatasetViewTypeEnum;
            if (Object.values(DatasetViewTypeEnum).includes(tab)) {
                return tab;
            }
        }

        return DatasetViewTypeEnum.Overview;
    }

    public onSelectDataset(accountName?: string, datasetName?: string): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: accountName ? accountName : this.datasetBasics.owner.accountName,
                datasetName: datasetName ? datasetName : this.datasetBasics.name,
                tab: DatasetViewTypeEnum.Lineage,
            });
        }
    }

    public onRunSQLRequest(params: DatasetRequestBySql): void {
        this.datasetService
            .requestDatasetDataSqlRun(params) // TODO: Propagate limit from UI and display when it was reached
            .subscribe();
    }
}
