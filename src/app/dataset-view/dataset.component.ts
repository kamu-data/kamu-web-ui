import {
    Component,
    HostListener,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import {
    DatasetKindInterface,
    DatasetNameInterface,
} from "../interface/search.interface";
import AppValues from "../common/app.values";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import {
    DatasetControlInterface,
    DatasetViewTypeEnum,
} from "./dataset-view.interface";
import { AppDatasetService } from "./dataset.service";
import { NavigationEnd, Router } from "@angular/router";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter } from "rxjs/operators";
import { ModalService } from "../components/modal/modal.service";
import { Dataset, DatasetKind } from "../api/kamu.graphql.interface";
import { BaseComponent } from "../common/base.component";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    styleUrls: ["./dataset-view.component.sass"],
    encapsulation: ViewEncapsulation.None,
})
export class DatasetComponent extends BaseComponent implements OnInit {
    public datasetInfo: Dataset;
    public datasetName: DatasetNameInterface;
    public searchValue = "";
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.overview;

    public linageGraphView: [number, number] = [500, 600];
    public linageGraphLink: Edge[] = [];
    public linageGraphNodes: Node[] = [];
    public linageGraphClusters: ClusterNode[] = [];
    public isAvailableLinageGraph = false;
    public isMarkdownEditView = false;
    public markdownText = AppValues.markdownContain;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.changeLinageGraphView();
    }

    constructor(
        private appDatasetService: AppDatasetService,
        private router: Router,
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
            this.appDatasetService.onSearchDatasetInfoChanges.subscribe(
                (info: Dataset) => {
                    this.datasetInfo = info;
                },
            ),
            this.appDatasetService.onSearchDatasetNameChanges.subscribe(
                (datasetName: DatasetNameInterface) => {
                    this.datasetName = datasetName;
                },
            ),
            this.appDatasetService.onSearchChanges.subscribe(
                (value: string) => {
                    this.searchValue = value;
                },
            ),
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
        return `results in ${this.datasetInfo?.name || ""}`;
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

    public onSearchMetadata(currentPage: number): void {
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id: this.getDatasetId(),
                    type: AppValues.urlDatasetViewMetadataType,
                    p: currentPage,
                },
            },
        );

        this.datasetViewType = DatasetViewTypeEnum.metadata;
        this.appDatasetService.onSearchMetadata(
            this.getDatasetId(),
            currentPage - 1,
        );
    }

    public onSearchDataForDataset(): void {
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id: this.getDatasetId(),
                    type: AppValues.urlDatasetViewDataType,
                },
            },
        );
        this.datasetViewType = DatasetViewTypeEnum.data;

        this.appDatasetService.getDatasetDataSchema(this.getDatasetId(), 5, 0);
    }

    public onSearchDataForHistory(currentPage: number): void {
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id: this.getDatasetId(),
                    type: DatasetViewTypeEnum.history,
                    p: currentPage,
                },
            },
        );
        this.datasetViewType = DatasetViewTypeEnum.history;

        this.appDatasetService.onDatasetHistorySchema(
            this.getDatasetId(),
            20,
            currentPage - 1,
        );
    }

    public onSearchDiscussions(): void {
        console.log("onSearchDiscussions");
    }

    public showOwnerPage(): void {
        this.router.navigate([this.datasetInfo.owner.id]);
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

    public onSearchDataset(page = 0): void {
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id: this.getDatasetId(),
                    type: AppValues.urlDatasetViewOverviewType,
                },
            },
        );

        this.datasetViewType = DatasetViewTypeEnum.overview;

        this.appDatasetService.getDatasetOverview(this.getDatasetId(), page);
    }

    public onSearchLinageDataset(): void {
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id: this.getDatasetId(),
                    type: DatasetViewTypeEnum.linage,
                },
            },
        );

        this.datasetViewType = DatasetViewTypeEnum.linage;
        this.appDatasetService.resetDatasetTree();
        this.appDatasetService.onSearchLineage(this.getDatasetId());

        this.changeLinageGraphView();
    }

    public onSearcDiscussions(): void {
        console.log("Projections Tab");
        this.onSearchDataset();
    }

    public onClickNode(idDataset: string): void {
        this.datasetViewType = DatasetViewTypeEnum.overview;
        this.onSelectDataset(idDataset);
    }

    public getParentMethod(): DatasetControlInterface {
        return {
            onSearchDataset: () => {
                this.onSearchDataset();
            },
            onSearchDataForDataset: () => {
                this.onSearchDataForDataset();
            },
            onSearchMetadata: (currentPage: number) => {
                this.onSearchMetadata(currentPage);
            },
            onSearchDataForHistory: (currentPage: number) => {
                this.onSearchDataForHistory(currentPage);
            },
            onSearchLinageDataset: () => {
                this.onSearchLinageDataset();
            },
            onSearchDiscussions: () => {
                this.onSearchDiscussions();
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
        ).split("&type=");
        const searchPageParams: string[] = decodeURIComponent(
            this.searchString,
        ).split("&p=");
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
                this.onSearchDataset();
            }
            if (type === DatasetViewTypeEnum.data) {
                this.onSearchDataForDataset();
            }
            if (type === DatasetViewTypeEnum.metadata) {
                this.onSearchMetadata(page);
            }
            if (type === DatasetViewTypeEnum.history) {
                this.onSearchDataForHistory(page);
            }
            if (type === DatasetViewTypeEnum.linage) {
                this.onSearchLinageDataset();
            }
            if (type === DatasetViewTypeEnum.discussions) {
                this.onSearchDiscussions();
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
        this.router.navigate(
            [AppValues.defaultUsername, AppValues.urlDatasetView],
            {
                queryParams: {
                    id,
                    type: AppValues.urlDatasetViewLineageType,
                },
            },
        );
    }
    public onRunSQLRequest(query: string): void {
        this.appDatasetService.onGetDatasetDataSQLRun(
            this.datasetInfo,
            query,
            50, // TODO: Propagate limit from UI and display when it was reached
        );
    }

    ngOnDestroy() {
        if (this.appDatasetService.onSearchLineageDatasetSubscription) {
            this.appDatasetService.onSearchLineageDatasetSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
}
