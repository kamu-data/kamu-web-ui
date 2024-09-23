import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { NavigationEnd, Router } from "@angular/router";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter, finalize, first, switchMap, tap } from "rxjs/operators";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import ProjectLinks from "../project-links";
import { DatasetInfo } from "../interface/navigation.interface";
import { promiseWithCatch } from "../common/app.helpers";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { MaybeNull, MaybeUndefined } from "../common/app.types";
import { ReplaySubject, Subject, of } from "rxjs";
import { LineageGraphNodeData, LineageGraphNodeKind } from "./additional-components/lineage-component/lineage-model";
import _ from "lodash";
import { BaseDatasetDataComponent } from "../common/base-dataset-data.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ElementsViewService, EnumViewActions } from "../services/elements-view.service";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent extends BaseDatasetDataComponent implements OnInit {
    public datasetBasics: MaybeUndefined<DatasetBasicsFragment>;
    public datasetInfo: DatasetInfo;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.Overview;
    public readonly DatasetViewTypeEnum = DatasetViewTypeEnum;
    public sqlLoading: boolean = false;

    private mainDatasetQueryComplete$: Subject<DatasetInfo> = new ReplaySubject<DatasetInfo>(1 /* bufferSize */);

    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private elementsViewService = inject(ElementsViewService);

    public ngOnInit(): void {
        const urlDatasetInfo = this.getDatasetInfoFromUrl();
        this.initDatasetViewByType(urlDatasetInfo, this.getCurrentPageFromUrl());
        this.requestMainData(urlDatasetInfo);

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.initDatasetViewByType(this.getDatasetInfoFromUrl(), this.getCurrentPageFromUrl());
                this.requestMainDataIfChanged();
            });
        this.datasetService.datasetChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((basics: DatasetBasicsFragment) => {
                this.datasetBasics = basics;
                this.datasetInfo = { accountName: basics.owner.accountName, datasetName: basics.name };
                this.cdr.markForCheck();
            });

        this.datasetPermissions$ = this.datasetSubsService.permissionsChanges;
    }

    private requestMainDataIfChanged(): void {
        const urlDatasetInfo = this.getDatasetInfoFromUrl();
        if (
            _.isNil(this.datasetBasics) ||
            this.datasetBasics.name !== urlDatasetInfo.datasetName ||
            this.datasetBasics.owner.accountName !== urlDatasetInfo.accountName ||
            this.datasetViewType === DatasetViewTypeEnum.Flows
        ) {
            this.requestMainData(urlDatasetInfo);
        }
    }

    public requestMainData(datasetInfo: DatasetInfo): void {
        this.datasetService
            .requestDatasetMainData(datasetInfo)
            .pipe(
                tap(() => {
                    this.mainDatasetQueryComplete$.next(datasetInfo);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
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

    private initFlowsTab(datasetInfo: DatasetInfo): void {
        this.mainDatasetQueryComplete$
            .pipe(
                filter(
                    (info: DatasetInfo) =>
                        info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
                ),
                first(),
                switchMap(() => this.datasetPermissions$.pipe(first())),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((datasetPermissions: DatasetPermissionsFragment) => {
                if (this.elementsViewService.executeAction(EnumViewActions.SHOW_FLOWS_TAB_ACTION, datasetPermissions)) {
                    this.datasetViewType = DatasetViewTypeEnum.Flows;
                } else {
                    this.datasetViewType = DatasetViewTypeEnum.Overview;
                }
                this.cdr.detectChanges();
            });
    }

    private initHistoryTab(datasetInfo: DatasetInfo, currentPage: number): void {
        this.datasetViewType = DatasetViewTypeEnum.History;

        this.mainDatasetQueryComplete$
            .pipe(
                filter(
                    (info: DatasetInfo) =>
                        info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
                ),
                first(),
                switchMap((info: DatasetInfo) => {
                    if (this.datasetViewType === DatasetViewTypeEnum.History) {
                        return this.datasetService.requestDatasetHistory(info, 20, currentPage - 1);
                    } else {
                        return of();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private initLineageTab(datasetInfo: DatasetInfo): void {
        this.datasetViewType = DatasetViewTypeEnum.Lineage;

        this.mainDatasetQueryComplete$
            .pipe(
                filter(
                    (info: DatasetInfo) =>
                        info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
                ),
                first(),
                switchMap((info) => {
                    if (this.datasetViewType === DatasetViewTypeEnum.Lineage) {
                        return this.datasetService.requestDatasetLineage(info);
                    } else {
                        return of();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
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
        this.mainDatasetQueryComplete$
            .pipe(
                filter(
                    (info: DatasetInfo) =>
                        info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
                ),
                first(),
                switchMap(() => this.datasetPermissions$.pipe(first())),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((datasetPermissions: DatasetPermissionsFragment) => {
                if (
                    this.elementsViewService.executeAction(EnumViewActions.SHOW_SETTINGS_TAB_ACTION, datasetPermissions)
                ) {
                    this.datasetViewType = DatasetViewTypeEnum.Settings;
                } else {
                    this.datasetViewType = DatasetViewTypeEnum.Overview;
                }
                this.cdr.detectChanges();
            });
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
            [DatasetViewTypeEnum.Flows]: () => this.initFlowsTab(datasetInfo),
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
        this.sqlLoading = true;
        this.datasetService
            // TODO: Propagate limit from UI and display when it was reached
            .requestDatasetDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        this.cdr.detectChanges();
    }
}
