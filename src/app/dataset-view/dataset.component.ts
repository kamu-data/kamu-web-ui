import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { DatasetService } from "./dataset.service";
import { NavigationEnd, Router } from "@angular/router";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter, tap } from "rxjs/operators";
import { DatasetBasicsFragment } from "../api/kamu.graphql.interface";
import ProjectLinks from "../project-links";
import { DatasetInfo } from "../interface/navigation.interface";
import { promiseWithCatch } from "../common/app.helpers";
import { BaseProcessingComponent } from "../common/base.processing.component";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { MaybeNull } from "../common/app.types";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    styleUrls: ["./dataset-view.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetComponent extends BaseProcessingComponent implements OnInit, OnDestroy {
    public datasetBasics?: DatasetBasicsFragment;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.Overview;

    public lineageGraphView: [number, number] = [500, 600];

    @HostListener("window:resize")
    private checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    constructor(private appDatasetService: DatasetService, private router: Router, private cdr: ChangeDetectorRef) {
        super();
    }

    public ngOnInit(): void {
        this.checkWindowSize();
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    tap(() => this.getMainDataByLineageNode()),
                )
                .subscribe(() => {
                    this.initDatasetViewByType(this.getDatasetInfoFromUrl(), this.getCurrentPageFromUrl());
                }),
            this.appDatasetService.requestDatasetMainData(this.getDatasetInfoFromUrl()).subscribe(),
            this.appDatasetService.onDatasetChanges.subscribe((basics: DatasetBasicsFragment) => {
                this.datasetBasics = basics;
                this.cdr.markForCheck();
            }),
        );
        this.initDatasetViewByType(this.getDatasetInfoFromUrl(), this.getCurrentPageFromUrl());
    }

    public getMainDataByLineageNode(): void {
        if (this.datasetBasics?.name !== this.getDatasetInfoFromUrl().datasetName) {
            this.appDatasetService.requestDatasetMainData(this.getDatasetInfoFromUrl()).subscribe();
        }
    }

    public changeLineageGraphView(): void {
        if (this.datasetViewType === DatasetViewTypeEnum.Lineage) {
            setTimeout(() => {
                const searchResultContainer: MaybeNull<HTMLElement> =
                    document.getElementById("searchResultContainerContent");
                if (searchResultContainer) {
                    const styleElement: CSSStyleDeclaration = getComputedStyle(searchResultContainer);
                    this.lineageGraphView[0] =
                        searchResultContainer.offsetWidth -
                        parseInt(styleElement.paddingLeft, 10) -
                        parseInt(styleElement.paddingRight, 10);
                    this.lineageGraphView[1] = 400;
                }
            });
        }
    }

    public onPageChange(currentPage: number): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: this.datasetBasics.owner.name,
                datasetName: this.datasetBasics.name,
                tab: this.datasetViewType,
                page: currentPage,
            });
            this.initDatasetViewByType(
                {
                    accountName: this.datasetBasics.owner.name,
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
        this.appDatasetService.requestDatasetHistory(datasetInfo, 20, currentPage - 1).subscribe();
    }

    private initLineageTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.Lineage;
        this.changeLineageGraphView();
    }

    public initDiscussionsTab(): void {
        console.log("initDiscussionsTab");
    }

    public initSettingsTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.Settings;
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
        this.onSelectDataset(node.label);
    }

    public onClickMetadataNode(dataset: DatasetBasicsFragment): void {
        this.onSelectDataset(dataset.name);
    }

    public get isDatasetViewTypeOverview(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Overview;
    }

    public get isDatasetViewTypeData(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Data;
    }

    public get isDatasetViewTypeMetadata(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Metadata;
    }

    public get isDatasetViewTypeHistory(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.History;
    }

    public get isDatasetViewTypeLineage(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Lineage;
    }

    public get isDatasetViewTypeDiscussions(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Discussions;
    }

    public get isDatasetViewTypeSettings(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.Settings;
    }

    private initDatasetViewByType(datasetInfo: DatasetInfo, currentPage: number): void {
        const mapperTabs: { [key in DatasetViewTypeEnum]: () => void } = {
            [DatasetViewTypeEnum.Overview]: () => this.initOverviewTab(),
            [DatasetViewTypeEnum.Data]: () => this.initDataTab(),
            [DatasetViewTypeEnum.Metadata]: () => this.initMetadataTab(),
            [DatasetViewTypeEnum.History]: () => this.initHistoryTab(datasetInfo, currentPage),
            [DatasetViewTypeEnum.Lineage]: () => this.initLineageTab(),
            [DatasetViewTypeEnum.Discussions]: () => this.initDiscussionsTab(),
            [DatasetViewTypeEnum.Settings]: () => this.initSettingsTab(),
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
            console.error(`Unrecognized tab '${tabValue}'`);
        }

        return DatasetViewTypeEnum.Overview;
    }

    public onSelectDataset(datasetName?: string): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: this.datasetBasics.owner.name,
                datasetName: datasetName ? datasetName : this.datasetBasics.name,
                tab: DatasetViewTypeEnum.Lineage,
            });
        }
    }

    public onRunSQLRequest(params: DatasetRequestBySql): void {
        this.appDatasetService
            .requestDatasetDataSqlRun(params) // TODO: Propagate limit from UI and display when it was reached
            .subscribe();
    }
}
