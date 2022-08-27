import { NavigationService } from "./../services/navigation.service";
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "./dataset-view.interface";
import { AppDatasetService } from "./dataset.service";
import {
    ActivatedRoute,
    NavigationEnd,
    ParamMap,
    Router,
} from "@angular/router";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter } from "rxjs/operators";
import { ModalService } from "../components/modal/modal.service";
import { DatasetBasicsFragment } from "../api/kamu.graphql.interface";
import { BaseComponent } from "../common/base.component";
import ProjectLinks from "../project-links";
import { DatasetInfo } from "../interface/navigation.interface";
import { logError, requireValue } from "../common/app.helpers";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    styleUrls: ["./dataset-view.component.sass"],
    encapsulation: ViewEncapsulation.None,
})
export class DatasetComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    public datasetBasics?: DatasetBasicsFragment;
    public searchValue = "";
    public isMinimizeSearchAdditionalButtons = false;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.Overview;

    public lineageGraphView: [number, number] = [500, 600];
    public isMarkdownEditView = false;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    constructor(
        private appDatasetService: AppDatasetService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        private modalService: ModalService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.checkWindowSize();
        this.trackSubscription(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.initDatasetViewByType(
                        this.getDatasetInfoFromUrl(),
                        this.getCurrentPageFromUrl(),
                    );
                }),
        );

        this.initDatasetViewByType(
            this.getDatasetInfoFromUrl(),
            this.getCurrentPageFromUrl(),
        );

        this.trackSubscriptions(
            this.appDatasetService.onSearchDatasetBasicsChanges.subscribe(
                (basics: DatasetBasicsFragment) => {
                    this.datasetBasics = basics;
                },
            ),
            this.appDatasetService.onSearchChanges.subscribe(
                (value: string) => {
                    this.searchValue = value;
                },
            ),
        );
    }

    public changeLineageGraphView(): void {
        if (this.datasetViewType === DatasetViewTypeEnum.Lineage) {
            setTimeout(() => {
                const searchResultContainer: HTMLElement | null =
                    document.getElementById("searchResultContainerContent");
                if (searchResultContainer !== null) {
                    const styleElement: CSSStyleDeclaration = getComputedStyle(
                        searchResultContainer,
                    );
                    this.lineageGraphView[0] =
                        searchResultContainer.offsetWidth -
                        parseInt(styleElement.paddingLeft, 10) -
                        parseInt(styleElement.paddingRight, 10);
                    this.lineageGraphView[1] = 400;
                }
            });
        }
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        if (this.datasetBasics) {
            this.initDatasetViewByType(
                {
                    accountName: this.datasetBasics.owner.name,
                    datasetName: this.datasetBasics.name as string,
                },
                params.currentPage,
            );
        }
    }

    public onClickSearchAdditionalButton(method: string) {
        if (method === searchAdditionalButtonsEnum.DeriveFrom) {
            this.onClickDeriveFrom();
        }
        if (method === searchAdditionalButtonsEnum.Reputation) {
            this.onClickReputation();
        }
        if (method === searchAdditionalButtonsEnum.Explore) {
            this.onClickExplore();
        }
        if (method === searchAdditionalButtonsEnum.Descission) {
            this.onClickDescission();
        }
        this.modalService.warning({
            message: "Feature coming soon",
            yesButtonText: "Ok",
        }).catch(e => logError(e));
    }

    private initOverviewTab(datasetInfo: DatasetInfo): void {
        this.datasetViewType = DatasetViewTypeEnum.Overview;
        this.appDatasetService.getDatasetOverview(datasetInfo);
    }

    private initDataTab(datasetInfo: DatasetInfo): void {
        this.datasetViewType = DatasetViewTypeEnum.Data;
        this.appDatasetService.getDatasetDataSchema(datasetInfo);
    }

    private initMetadataTab(
        datasetInfo: DatasetInfo,
        currentPage: number,
    ): void {
        this.datasetViewType = DatasetViewTypeEnum.Metadata;
        this.appDatasetService.onSearchMetadata(datasetInfo, currentPage - 1);
    }

    private initHistoryTab(
        datasetInfo: DatasetInfo,
        currentPage: number,
    ): void {
        this.datasetViewType = DatasetViewTypeEnum.History;
        this.appDatasetService.onDatasetHistorySchema(
            datasetInfo,
            20,
            currentPage - 1,
        );
    }

    private initLineageTab(datasetInfo: DatasetInfo): void {
        this.datasetViewType = DatasetViewTypeEnum.Lineage;
        this.appDatasetService.onSearchLineage(datasetInfo);
        this.changeLineageGraphView();
    }

    public initDiscussionsTab(): void {
        console.log("initDiscussionsTab");
    }

    public showOwnerPage(): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToOwnerView(
                this.datasetBasics.owner.name,
            );
        }
    }

    public toggleReadmeView(): void {
        this.isMarkdownEditView = !this.isMarkdownEditView;
    }

    public selectTopic(topicName: string): void {
        this.modalService.warning({
            message: "Feature coming soon",
            yesButtonText: "Ok",
            title: topicName,
        }).catch(e => logError(e));
    }

    public onClickLineageNode(node: Node): void {
        this.onSelectDataset(node.label);
    }

    public onClickMetadataNode(dataset: DatasetBasicsFragment): void {
        this.onSelectDataset(dataset.name as string);
    }

    public getDatasetNavigation(): DatasetNavigationInterface {
        return {
            navigateToOverview: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Overview,
                    });
                }
            },
            navigateToData: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Data,
                    });
                }
            },
            navigateToMetadata: (currentPage: number) => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Metadata,
                        page: currentPage,
                    });
                }
            },
            navigateToHistory: (currentPage: number) => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.History,
                        page: currentPage,
                    });
                }
            },
            navigateToLineage: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name as string,
                        tab: DatasetViewTypeEnum.Lineage,
                    });
                }
            },
            navigateToDiscussions: () => {
                console.log("Navigate to discussions");
            },
        };
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

    private onClickDeriveFrom(): void {
        console.log("onClickDeriveFrom");
    }

    private onClickExplore(): void {
        console.log("onClickExplore");
    }

    private onClickReputation(): void {
        console.log("onClickReputation");
    }

    private onClickDescission(): void {
        console.log("onClickDescission");
    }

    private initDatasetViewByType(
        datasetInfo: DatasetInfo,
        currentPage: number,
    ): void {
        const mapperTabs: { [key in DatasetViewTypeEnum]: () => void } = {
            [DatasetViewTypeEnum.Overview]: () =>
                this.initOverviewTab(datasetInfo),
            [DatasetViewTypeEnum.Data]: () => this.initDataTab(datasetInfo),
            [DatasetViewTypeEnum.Metadata]: () =>
                this.initMetadataTab(datasetInfo, currentPage),
            [DatasetViewTypeEnum.History]: () =>
                this.initHistoryTab(datasetInfo, currentPage),
            [DatasetViewTypeEnum.Lineage]: () =>
                this.initLineageTab(datasetInfo),
            [DatasetViewTypeEnum.Discussions]: () => this.initDiscussionsTab(),
        };

        this.datasetViewType = this.getDatasetViewTypeFromUrl();
        mapperTabs[this.datasetViewType]();
    }

    private getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: requireValue(paramMap.get(ProjectLinks.urlParamAccountName)),
            datasetName: requireValue(paramMap.get(ProjectLinks.urlParamDatasetName)),
        };
    }

    private getCurrentPageFromUrl(): number {
        const page: string | null =
            this.activatedRoute.snapshot.queryParamMap.get(
                ProjectLinks.urlQueryParamPage,
            );
        return page ? Number(page) : 1;
    }

    private getDatasetViewTypeFromUrl(): DatasetViewTypeEnum {
        const tabValue: string | null =
            this.activatedRoute.snapshot.queryParamMap.get(
                ProjectLinks.urlQueryParamTab,
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
                datasetName: datasetName
                    ? datasetName
                    : this.datasetBasics.name as string,
                tab: DatasetViewTypeEnum.Lineage,
            });
        }
    }

    public onRunSQLRequest(query: string): void {
        if (this.datasetBasics) {
            this.appDatasetService.onGetDatasetDataSQLRun(
                query,
                50, // TODO: Propagate limit from UI and display when it was reached
            );
        }
    }
}
