import { NavigationService } from "./../services/navigation.service";
import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { DatasetKindInterface } from "../interface/search.interface";
import AppValues from "../common/app.values";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import {
    DatasetNavigationInterface,
    DatasetViewTypeEnum,
} from "./dataset-view.interface";
import { AppDatasetService } from "./dataset.service";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
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
    public initialDatasetViewType: typeof DatasetViewTypeEnum =
        DatasetViewTypeEnum;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.overview;

    public linageGraphView: [number, number] = [500, 600];
    public linageGraphLink: Edge[] = [];
    public linageGraphNodes: Node[] = [];
    public linageGraphClusters: ClusterNode[] = [];
    public isAvailableLinageGraph = false;
    public isMarkdownEditView = false;
    public markdownText = AppValues.markdownContain;

    private selectedDatasetName: string;
    private datasetId: string;
    private urlDatasetName: string;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.changeLinageGraphView();
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
                .subscribe((event: any) => {
                    this.initDatasetViewByType();
                }),
        );

        this.initDatasetViewByType();

        this.prepareLinageGraph();

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
            this.activatedRoute.paramMap.subscribe(({ params }: Params) => {
                this.urlDatasetName = params.datasetName;
                console.log("qqqqq", this.urlDatasetName);
            }),
        );
    }

    public changeLinageGraphView(): void {
        if (this.datasetViewType === DatasetViewTypeEnum.linage) {
            setTimeout(() => {
                const searchResultContainer: HTMLElement | null =
                    document.getElementById("searchResultContainerContent");
                if (searchResultContainer !== null) {
                    const styleElement: CSSStyleDeclaration = getComputedStyle(
                        searchResultContainer,
                    );
                    this.linageGraphView[0] =
                        searchResultContainer.offsetWidth -
                        parseInt(styleElement.paddingLeft) -
                        parseInt(styleElement.paddingRight);
                    this.linageGraphView[1] = 400;
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
        this.initDatasetViewByType(params.currentPage);
    }

    public getResultUnitText(): string {
        return `results in ${this.datasetBasics?.name || ""}`;
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

    private initOverviewTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.overview;
        this.appDatasetService.getDatasetOverview(this.getDatasetId());
    }

    private initDataTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.data;
        this.appDatasetService.getDatasetDataSchema(this.getDatasetId());
    }

    private initMetadataTab(currentPage: number): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: AppValues.defaultUsername,
                datasetName: this.datasetBasics?.name,
                id: this.getDatasetId(),
                tab: ProjectLinks.urlDatasetViewMetadataType,
                page: currentPage,
            });
        }

        this.datasetViewType = DatasetViewTypeEnum.metadata;
        this.appDatasetService.onSearchMetadata(
            this.getDatasetId(),
            currentPage - 1,
        );
    }

    private initHistoryTab(currentPage: number): void {
        this.datasetViewType = DatasetViewTypeEnum.history;
        this.appDatasetService.onDatasetHistorySchema(
            this.getDatasetId(),
            20,
            currentPage - 1,
        );
    }

    private initLineageTab(): void {
        this.datasetViewType = DatasetViewTypeEnum.linage;
        this.appDatasetService.resetDatasetTree();
        this.appDatasetService.onSearchLineage(this.getDatasetId());

        this.changeLinageGraphView();
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
        });
    }

    public onClickNode(node: any): void {
        this.selectedDatasetName = node.label;
        this.datasetViewType = DatasetViewTypeEnum.overview;
        this.onSelectDataset(node?.data.id);
    }

    public getDatasetNavigation(): DatasetNavigationInterface {
        return {
            navigateToOverview: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: AppValues.defaultUsername,
                    datasetName: this.datasetBasics?.name,
                    id: this.getDatasetId(),
                    tab: ProjectLinks.urlDatasetViewOverviewType,
                });
            },
            navigateToData: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: AppValues.defaultUsername,
                    datasetName: this.datasetBasics?.name,
                    id: this.getDatasetId(),
                    tab: ProjectLinks.urlDatasetViewDataType,
                });
            },
            navigateToMetadata: (currentPage: number) => {
                this.navigationService.navigateToDatasetView({
                    accountName: AppValues.defaultUsername,
                    datasetName: this.datasetBasics?.name,
                    id: this.getDatasetId(),
                    tab: ProjectLinks.urlDatasetViewMetadataType,
                    page: currentPage,
                });
            },
            navigateToHistory: (currentPage: number) => {
                this.navigationService.navigateToDatasetView({
                    accountName: AppValues.defaultUsername,
                    datasetName: this.datasetBasics?.name,
                    id: this.getDatasetId(),
                    tab: ProjectLinks.urlDatasetViewHistoryType,
                    page: currentPage,
                });
            },
            navigateToLineage: () => {
                this.navigationService.navigateToDatasetView({
                    accountName: AppValues.defaultUsername,
                    datasetName: this.datasetBasics?.name,
                    id: this.getDatasetId(),
                    tab: ProjectLinks.urlDatasetViewLineageType,
                });
            },
            navigateToDiscussions: () => {
                console.log("Navigate to discussions");
            },
        };
    }

    public get isDatasetViewTypeOverview(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.overview;
    }

    public get isDatasetViewTypeData(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.data;
    }

    public get isDatasetViewTypeMetadata(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.metadata;
    }

    public get isDatasetViewTypeHistory(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.history;
    }

    public get isDatasetViewTypeLinage(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.linage;
    }

    public get isDatasetViewTypeDiscussions(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.discussions;
    }

    private initLinageGraphProperty(): void {
        this.linageGraphNodes = [];
        this.linageGraphLink = [];
    }

    private prepareLinageGraph(): void {
        this.appDatasetService.resetDatasetTree();
        this.appDatasetService.resetKindInfo();
        this.initLinageGraphProperty();
        this.linageGraphClusters = [
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

                    this.initLinageGraphProperty();

                    this.isAvailableLinageGraph = edges.length !== 0;

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
                        this.linageGraphNodes.push({
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

                        this.linageGraphLink.push({
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
                        this.linageGraphClusters = this.linageGraphClusters.map(
                            (cluster: ClusterNode) => {
                                if (
                                    typeof cluster.childNodeIds === "undefined"
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
        while (true) {
            const nid = id.replace(":", "");
            if (nid === id) {
                return id;
            }
            id = nid;
        }
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

    private initDatasetViewByType(currentPage?: number): void {
        if (this.appDatasetService.onSearchLineageDatasetSubscription) {
            this.appDatasetService.onSearchLineageDatasetSubscription.unsubscribe();
        }
        this.appDatasetService.resetDatasetTree();
        const searchParams: string[] = decodeURIComponent(
            this.searchString,
        ).split("&tab=");
        const searchPageParams: string[] = decodeURIComponent(
            this.searchString,
        ).split("&page=");
        let page = 1;
        if (searchPageParams[1]) {
            page = currentPage || Number(searchPageParams[1].split("&")[0]);
        }

        if (searchParams.length > 1) {
            const type: DatasetViewTypeEnum = AppValues.fixedEncodeURIComponent(
                searchParams[1].split("&")[0],
            ) as DatasetViewTypeEnum;

            this.datasetViewType = type;
            if (type === DatasetViewTypeEnum.overview) {
                this.initOverviewTab();
            }
            if (type === DatasetViewTypeEnum.data) {
                this.initDataTab();
            }
            if (type === DatasetViewTypeEnum.metadata) {
                this.initMetadataTab(page);
            }
            if (type === DatasetViewTypeEnum.history) {
                this.initHistoryTab(page);
            }
            if (type === DatasetViewTypeEnum.linage) {
                this.initLineageTab();
            }
            if (type === DatasetViewTypeEnum.discussions) {
                this.initDiscussionsTab();
            }
        }
    }

    private getDatasetId(): string {
        const searchParams: string[] = decodeURIComponent(
            this.searchString,
        ).split("?id=");

        if (searchParams.length > 1) {
            return searchParams[1].split("&")[0];
        }
        return "";
    }

    public onSelectDataset(id: string): void {
        if (this.datasetBasics) {
            this.navigationService.navigateToDatasetView({
                accountName: AppValues.defaultUsername,
                datasetName: this.selectedDatasetName
                    ? this.selectedDatasetName
                    : this.datasetBasics?.name,
                id,
                tab: ProjectLinks.urlDatasetViewLineageType,
            });
        }
    }
    public onRunSQLRequest(query: string): void {
        if (this.datasetBasics) {
            this.appDatasetService.onGetDatasetDataSQLRun(
                this.datasetBasics,
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
