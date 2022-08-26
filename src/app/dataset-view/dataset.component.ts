import { NavigationService } from "./../services/navigation.service";
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { DatasetKindInterface } from "../interface/search.interface";
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
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter } from "rxjs/operators";
import { ModalService } from "../components/modal/modal.service";
import {
    DatasetBasicsFragment,
    DatasetKind,
} from "../api/kamu.graphql.interface";
import { BaseComponent } from "../common/base.component";
import ProjectLinks from "../project-links";
import { DatasetInfo } from "../interface/navigation.interface";
import { AppHelpers } from "../common/app.helpers";

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
    public lineageGraphLink: Edge[] = [];
    public lineageGraphNodes: Node[] = [];
    public lineageGraphClusters: ClusterNode[] = [];
    public isAvailableLineageGraph = false;
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

        this.prepareLineageGraph();

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

    public getDatasetTree(): { id: string; kind: DatasetKind }[][] {
        return this.appDatasetService.getDatasetTree;
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        if (this.datasetBasics) {
            this.initDatasetViewByType(
                {
                    accountName: this.datasetBasics.owner.name,
                    datasetName: this.datasetBasics.name,
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
        });
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
        this.appDatasetService.resetDatasetTree();
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
        });
    }

    public onClickLineageNode(node: Node): void {
        this.onSelectDataset(node.label);
    }

    public onClickMetadataNode(dataset: DatasetBasicsFragment): void {
        this.onSelectDataset(dataset.name);
    }

    public getDatasetNavigation(): DatasetNavigationInterface {
        return {
            navigateToOverview: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name,
                        tab: DatasetViewTypeEnum.Overview,
                    });
                }
            },
            navigateToData: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name,
                        tab: DatasetViewTypeEnum.Data,
                    });
                }
            },
            navigateToMetadata: (currentPage: number) => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name,
                        tab: DatasetViewTypeEnum.Metadata,
                        page: currentPage,
                    });
                }
            },
            navigateToHistory: (currentPage: number) => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name,
                        tab: DatasetViewTypeEnum.History,
                        page: currentPage,
                    });
                }
            },
            navigateToLineage: () => {
                if (this.datasetBasics) {
                    this.navigationService.navigateToDatasetView({
                        accountName: this.datasetBasics.owner.name,
                        datasetName: this.datasetBasics.name,
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

    private initLineageGraphProperty(): void {
        this.lineageGraphNodes = [];
        this.lineageGraphLink = [];
    }

    private prepareLineageGraph(): void {
        this.appDatasetService.resetDatasetTree();
        this.appDatasetService.resetKindInfo();
        this.initLineageGraphProperty();
        this.lineageGraphClusters = [
            {
                id: DatasetKind.Root + "_cluster",
                label: DatasetKind.Root,
                data: { customColor: "#A52A2A59" },
                position: { x: 10, y: 10 },
                childNodeIds: [],
            },
            {
                id: DatasetKind.Derivative + "_cluster",
                label: DatasetKind.Derivative,
                data: { customColor: "#00800039" },
                position: { x: 10, y: 10 },
                childNodeIds: [],
            },
        ];

        this.trackSubscriptions(
            this.appDatasetService.onDatasetTreeChanges.subscribe(
                (args: [DatasetKindInterface[][], DatasetKindInterface]) => {
                    const edges = args[0];
                    const currentDataset = args[1];

                    this.initLineageGraphProperty();

                    this.isAvailableLineageGraph = edges.length !== 0;

                    const uniqueDatasets: {
                        [id: string]: DatasetKindInterface;
                    } = {};
                    edges.forEach((edge: DatasetKindInterface[]) =>
                        edge.forEach((dataset: DatasetKindInterface) => {
                            uniqueDatasets[dataset.id] = dataset;
                        }),
                    );

                    for (const [id, dataset] of Object.entries(
                        uniqueDatasets,
                    )) {
                        this.lineageGraphNodes.push({
                            id: this.sanitizeID(id),
                            label: dataset.name,
                            data: {
                                id: dataset.id,
                                name: dataset.name,
                                kind: dataset.kind,
                                isRoot: dataset.kind === DatasetKind.Root,
                                isCurrent: dataset.id === currentDataset.id,
                            },
                        });
                    }

                    edges.forEach((edge: DatasetKindInterface[]) => {
                        const source: string = this.sanitizeID(edge[0].id);
                        const target: string = this.sanitizeID(edge[1].id);

                        this.lineageGraphLink.push({
                            id: `${source}__and__${target}`,
                            source,
                            target,
                        });
                    });
                },
            ),
            this.appDatasetService.onKindInfoChanges.subscribe(
                (datasetList: DatasetKindInterface[]) => {
                    datasetList.forEach((dataset: DatasetKindInterface) => {
                        this.lineageGraphClusters =
                            this.lineageGraphClusters.map(
                                (cluster: ClusterNode) => {
                                    if (
                                        typeof cluster.childNodeIds ===
                                        "undefined"
                                    ) {
                                        cluster.childNodeIds = [];
                                    }

                                    if (cluster.label === dataset.kind) {
                                        cluster.childNodeIds.push(dataset.id);
                                    }
                                    return cluster;
                                },
                            );
                    });
                },
            ),
        );
    }

    // TODO: Use `String.replaceAll()`
    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
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
        if (this.appDatasetService.onSearchLineageDatasetSubscription) {
            this.appDatasetService.onSearchLineageDatasetSubscription.unsubscribe();
        }
        this.datasetViewType = this.getDatasetViewTypeFromUrl();

        this.appDatasetService.resetDatasetTree();

        mapperTabs[this.datasetViewType]();
    }

    private getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            // Both parameters are mandatory in URL, router would not activate this component otherwise
            accountName: AppHelpers.requireValue(paramMap.get(ProjectLinks.urlParamAccountName)),
            datasetName: AppHelpers.requireValue(paramMap.get(ProjectLinks.urlParamDatasetName)),
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
                    : this.datasetBasics.name,
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

    ngOnDestroy() {
        if (this.appDatasetService.onSearchLineageDatasetSubscription) {
            this.appDatasetService.onSearchLineageDatasetSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}
