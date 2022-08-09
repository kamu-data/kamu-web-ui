import {
    AfterContentInit,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    DatasetKindInterface,
    DatasetNameInterface,
    DataViewSchema,
    SearchHistoryInterface,
    SearchOverviewDatasetsInterface,
    SearchOverviewInterface,
} from "../interface/search.interface";
import AppValues from "../common/app.values";
import {
    SearchAdditionalHeaderButtonInterface,
} from "../components/search-additional-buttons/search-additional-buttons.interface";
import { MatSidenav } from "@angular/material/sidenav";
import { SideNavService } from "../services/sidenav.service";
import { searchAdditionalButtonsEnum } from "../search/search.interface";
import {DatasetViewContentInterface, DatasetViewTypeEnum, PaginationInfoInterface} from "./dataset-view.interface";
import { AppDatasetService } from "./dataset.service";
import { NavigationEnd, Router } from "@angular/router";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { filter } from "rxjs/operators";
import { ModalService } from "../components/modal/modal.service";
import { Clipboard } from "@angular/cdk/clipboard";
import {
    DataSchema, Dataset,
    DatasetKind, MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DataHelpersService } from "../services/datahelpers.service";
import {AppDatasetSubsService} from "./datasetSubs.service";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset.component.html",
    styleUrls: ["./dataset-view.component.sass"],
    encapsulation: ViewEncapsulation.None,
})
export class DatasetComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    @ViewChild("menuTrigger") trigger: any;
    public isMobileView = false;
    public datasetInfo: Dataset;
    public datasetName: DatasetNameInterface;
    public searchValue = "";
    public currentPage: number;
    public currentSchema: DataViewSchema;
    public isMinimizeSearchAdditionalButtons = false;
    public datasetViewType: DatasetViewTypeEnum = DatasetViewTypeEnum.overview;
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonInterface[] =
        [
            {
                textButton: searchAdditionalButtonsEnum.Starred,
                counter: 2,
                // tslint:disable-next-line:max-line-length
                iconSvgPath:
                    "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
                svgClass:
                    "octicon octicon-star-fill starred-button-icon d-inline-block mr-2",
                iconSvgPathClass: "starred-button-icon",
            },
            {
                textButton: searchAdditionalButtonsEnum.UnWatch,
                counter: 1,
                // tslint:disable-next-line:max-line-length
                iconSvgPath:
                    "M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z",
                svgClass: "octicon octicon-eye mr-2",
                iconSvgPathClass: "",
                additionalOptions: {
                    title: "Notifications",
                    options: [
                        {
                            title: "Participating and @mentions",
                            text: "Only receive notifications from this repository when participating or @mentioned.",
                            value: "participating",
                        },
                        {
                            title: "All Activity",
                            text: "Notified of all notifications on this repository.",
                            value: "all",
                            isSelected: true,
                        },
                        {
                            title: "Ignore",
                            text: "Never be notified.",
                            value: "ignore",
                        },
                    ],
                },
            },
            {
                textButton: searchAdditionalButtonsEnum.DeriveFrom,
                counter: 4,
                // tslint:disable-next-line:max-line-length
                iconSvgPath:
                    "M13,9v2h-2.488c-0.047-0.006-0.131-0.044-0.169-0.069L7.416,8l2.931-2.931C10.384,5.041,10.469,5.006,10.516,5H13v2l3-3 l-3-3v2h-2.5C9.962,3,9.319,3.266,8.941,3.647L6.584,6H0v4h6.584l2.353,2.353C9.319,12.734,9.959,13,10.497,13h2.5v2l3-3L13,9z",
                svgClass: "octicon octicon-x mr-2",
                iconSvgPathClass: "",
            },
        ];

    public tableData: DatasetViewContentInterface;
    public datasetHistory: MetadataBlockFragment[];
    private searchOverviewDatasets: SearchHistoryInterface[] = [];
    private searchDataDatasets: SearchHistoryInterface[] = [];
    private searchMetadata: SearchOverviewDatasetsInterface[] = [];

    public linageGraphView: [number, number] = [500, 600];
    public linageGraphLink: Edge[] = [];
    public linageGraphNodes: Node[] = [];
    public linageGraphClusters: ClusterNode[] = [];
    public isAvailableLinageGraph = false;
    public headings: Element[] | undefined;
    public isMarkdownEditView = false;
    public clipboardKamuCli = "kamu pull kamu.dev/anonymous/dataset";
    public clipboardKafka = "https://api.kamu.dev/kafka/anonymous/dataset";
    public markdownText = AppValues.markdownContain;

    private w: Window;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();
        this.isMobileView = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close();
        } else {
            this.sidenavService.open();
        }
        this.changeLinageGraphView();
    }

    constructor(
        private appDatasetService: AppDatasetService,
        private sidenavService: SideNavService,
        private router: Router,
        private modalService: ModalService,
        private clipboard: Clipboard,
        private dataHelpers: DataHelpersService,
        private appDatasetSubsService: AppDatasetSubsService
    ) {
        this.w = window;
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);

        const currentEvent: EventTarget | null = event.currentTarget;

        if (currentEvent !== null) {
            setTimeout(() => {
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["children"][0].style.display = "inline-block";
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["children"][1].style.display = "none";
                // @ts-ignore
                // tslint:disable-next-line:no-string-literal
                currentEvent["classList"].remove("clipboard-btn--success");
            }, 2000);

            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["children"][0].style.display = "none";
            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["children"][1].style.display = "inline-block";
            // @ts-ignore
            // tslint:disable-next-line:no-string-literal
            currentEvent["classList"].add("clipboard-btn--success");
        }
    }

    public ngOnInit(): void {
        this.checkWindowSize();
        if (this.sidenav) {
            this.sidenavService.setSidenav(this.sidenav);
        }
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                this.initDatasetViewByType();
            });
        this.initDatasetViewByType();

        this.initTableData();

        this.prepareLinageGraph();

        this.appDatasetService.onDataSchemaChanges.subscribe(
            (schema: DataSchema) => {
                this.currentSchema = schema
                    ? JSON.parse(schema.content)
                    : ({} as DataViewSchema);
            },
        );

        this.appDatasetService.onDatasetPageInfoChanges.subscribe(
            (info: PaginationInfoInterface) => {
                this.tableData.pageInfo = info;
                if (info.page) {
                    this.currentPage = info.page + 1;
                }
            },
        );

        this.appDatasetService.onSearchDatasetInfoChanges.subscribe(
            (info: Dataset) => {
                this.datasetInfo = info;
            },
        );
        this.appDatasetService.onSearchDatasetNameChanges.subscribe(
            (datasetName: DatasetNameInterface) => {
                this.datasetName = datasetName;
            },
        );
        this.appDatasetService.onSearchChanges.subscribe((value: string) => {
            this.searchValue = value;
        });

        /* eslint-disable  @typescript-eslint/no-explicit-any */

        this.appDatasetSubsService.onDatasetOverviewChanges.subscribe((overview: SearchHistoryInterface[]) => {
            this.tableData.datasetOverviewSource = overview;
            this.searchOverviewDatasets = overview;
        });

        this.appDatasetSubsService.onDatasetDataChanges.subscribe((history: SearchHistoryInterface[]) => {
            this.tableData.datasetDataSource = history;
            this.searchDataDatasets = history;
        });

        this.appDatasetSubsService.onDatasetHistoryChanges.subscribe(
            (history: MetadataBlockFragment[]) => {
                this.tableData.datasetHistorySource = history;
                this.datasetHistory = history;
            },
        );

        this.appDatasetSubsService.onDatasetMetadataChanges.subscribe(
            (data: SearchOverviewInterface) => {
                if (data.dataset) {
                    this.tableData.datasetMetadataSource = data.dataset;
                    this.tableData.pageInfo = data.pageInfo;
                    this.tableData.totalCount = data.totalCount as number;
                    this.searchMetadata = data.dataset;

                    setTimeout(() => (this.currentPage = data.currentPage));
                }
            },
        );
    }

    public successCopyToClipboardCopied(): void {
        console.log("copy success");
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

    public ngAfterContentInit(): void {
        this.tableData.datasetOverviewSource = this.searchOverviewDatasets;
        this.tableData.datasetDataSource = this.searchDataDatasets;
        this.tableData.datasetMetadataSource = this.searchMetadata;
        this.tableData.datasetHistorySource = this.datasetHistory;
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.currentPage = params.currentPage;
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

    public get datasetViewTypeOverview(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.overview;
    }

    public get datasetViewTypeData(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.data;
    }

    public get datasetViewTypeMetadata(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.metadata;
    }

    public get datasetViewTypeHistory(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.history;
    }

    public get datasetViewTypeLinage(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.linage;
    }

    public get datasetViewTypeDiscussions(): boolean {
        return this.datasetViewType === DatasetViewTypeEnum.discussions;
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
        this.currentPage = currentPage;

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
        this.currentPage = currentPage;
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

        this.appDatasetService.onDatasetTreeChanges.subscribe(
            (args: [DatasetKindInterface[][], DatasetKindInterface]) => {
                const edges = args[0];
                const currentDataset = args[1];

                this.initLinageGraphProperty();

                this.isAvailableLinageGraph = edges.length !== 0;

                const uniqueDatasets: { [id: string]: DatasetKindInterface } = {};
                edges.forEach((edge: DatasetKindInterface[]) =>
                    edge.forEach((dataset: DatasetKindInterface) => {
                        uniqueDatasets[dataset.id] = dataset;
                    }),
                );

                for (const [id, dataset] of Object.entries(uniqueDatasets)) {
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
        );

        this.appDatasetService.onKindInfoChanges.subscribe(
            (datasetList: DatasetKindInterface[]) => {
                datasetList.forEach((dataset: DatasetKindInterface) => {
                    this.linageGraphClusters = this.linageGraphClusters.map(
                        (cluster: ClusterNode) => {
                            if (typeof cluster.childNodeIds === "undefined") {
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

    private initTableData(): void {
        this.tableData = {
            isTableHeader: true,
            datasetOverviewSource: this.searchOverviewDatasets,
            latestMetadataBlock: undefined,
            isResultQuantity: false,
            isClickableRow: false,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            },
            totalCount: 0,
        };
    }

    private initDatasetViewByType(currentPage?: number): void {
        if (this.appDatasetService.onSearchLineageDatasetSubscription) {
            this.appDatasetService.onSearchLineageDatasetSubscription.unsubscribe();
        }
        this.appDatasetService.resetDatasetTree();
        const searchParams: string[] = decodeURIComponent(
            this.w.location.search,
        ).split("&type=");
        const searchPageParams: string[] = decodeURIComponent(
            this.w.location.search,
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
                this.currentPage = page;
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
            this.w.location.search,
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
    }
}
