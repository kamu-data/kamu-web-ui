import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription, throwError } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetKindInterface,
    DataViewSchema,
} from "../interface/search.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetKind,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    DatasetOverviewQuery,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetLineageQuery,
    GetDatasetMetadataSchemaQuery,
    Maybe,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { ModalService } from "../components/modal/modal.service";
import { AppDatasetSubsService } from "./datasetSubs.service";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./datasetSubs.interface";
import { deepCopy } from "deep-copy-ts";
import { isNil } from "lodash";
import { Optional } from "../common/app.types";

@Injectable()
export class AppDatasetService {
    public onSearchLineageDatasetSubscription: Subscription;

    constructor(
        private searchApi: SearchApi,
        private modalService: ModalService,
        private appDatasetSubsService: AppDatasetSubsService,
    ) {}

    public get onSearchDatasetBasicsChanges(): Observable<DatasetBasicsFragment> {
        return this.searchDatasetInfoChanges$.asObservable();
    }

    public get onSearchChanges(): Observable<string> {
        return this.searchChanges$.asObservable();
    }

    public get onKindInfoChanges(): Observable<DatasetKindInterface[]> {
        return this.kindInfoChanges$.asObservable();
    }

    public get onDatasetTreeChanges(): Observable<
        [DatasetKindInterface[][], DatasetKindInterface]
    > {
        return this.datasetTreeChanges$.asObservable();
    }

    public get getDatasetTree(): {
        id: string;
        kind: DatasetKind;
    }[][] {
        return this.datasetTree;
    }

    public get kindInfo(): DatasetKindInterface[] {
        return this.datasetKindInfo;
    }

    private kindInfoChanges$: Subject<DatasetKindInterface[]> = new Subject<
        DatasetKindInterface[]
    >();
    private searchChanges$: Subject<string> = new Subject<string>();
    private searchDatasetInfoChanges$: Subject<DatasetBasicsFragment> =
        new Subject<DatasetBasicsFragment>();
    private datasetTreeChanges$: Subject<
        [DatasetKindInterface[][], DatasetKindInterface]
    > = new Subject<[DatasetKindInterface[][], DatasetKindInterface]>();

    private datasetTree: DatasetKindInterface[][] = [];
    private datasetKindInfo: DatasetKindInterface[] = [];

    private static parseContentOfDataset(data: DatasetOverviewQuery): Object[] {
        return data.datasets.byId
            ? JSON.parse(data.datasets?.byId?.data.tail.data.content)
            : [];
    }
    public get defaultPageInfo(): PageBasedInfo {
        return {
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 1,
            currentPage: 1,
        };
    }

    public searchDatasetInfoChanges(
        searchDatasetInfo: DatasetBasicsFragment,
    ): void {
        this.searchDatasetInfoChanges$.next(searchDatasetInfo);
    }

    public kindInfoChanges(datasetList: DatasetKindInterface[]): void {
        this.kindInfoChanges$.next(datasetList);
    }

    public datasetTreeChange(
        edges: DatasetKindInterface[][],
        origin: DatasetKindInterface,
    ): void {
        this.datasetTreeChanges$.next([edges, origin]);
    }

    public resetKindInfo(): void {
        this.datasetKindInfo = [];
        this.kindInfoChanges([]);
    }

    public setKindInfo(dataset: DatasetKindInterface): void {
        if (
            this.datasetKindInfo.some(
                (realDataset: DatasetKindInterface) =>
                    realDataset.id === dataset.id,
            )
        ) {
            return;
        }
        this.datasetKindInfo.push({
            id: dataset.id,
            kind: dataset.kind,
            name: dataset.name,
        });
        this.kindInfoChanges(this.datasetKindInfo);
    }

    public resetDatasetTree(): void {
        this.datasetTree = [];
    }

    public getDatasetDataSchema(
        id: string,
        numRecords: number,
        page: number,
    ): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: DatasetOverviewQuery) => {
                if (isNil(data.datasets.byId)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    deepCopy<DatasetBasicsFragment>(data.datasets.byId);
                this.searchDatasetInfoChanges(dataset);

                const content: Object[] =
                    AppDatasetService.parseContentOfDataset(data);
                const schema: DataViewSchema = JSON.parse(
                    data.datasets.byId.metadata.currentSchema.content,
                );
                const dataUpdate: DataUpdate = { content, schema };
                this.appDatasetSubsService.changeDatasetData(dataUpdate);
            });
    }

    public getDatasetOverview(id: string, page: number): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: DatasetOverviewQuery) => {
                if (isNil(data.datasets.byId)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    deepCopy<DatasetBasicsFragment>(data.datasets.byId);
                this.searchDatasetInfoChanges(dataset);

                const content: Object[] =
                    AppDatasetService.parseContentOfDataset(data);
                const overview: DatasetOverviewFragment =
                    deepCopy<DatasetOverviewFragment>(data.datasets.byId);
                const size: DatasetDataSizeFragment =
                    deepCopy<DatasetDataSizeFragment>(data.datasets.byId.data);
                const overviewDataUpdate: OverviewDataUpdate = {
                    content,
                    overview,
                    size,
                };
                this.appDatasetSubsService.changeDatasetOverviewData(
                    overviewDataUpdate,
                );
            });
    }

    public onDatasetHistorySchema(
        id: string,
        numRecords: number,
        numPage: number,
    ): void {
        this.searchApi
            .onDatasetHistory({ id, numRecords, numPage })
            .subscribe((data: GetDatasetHistoryQuery) => {
                const pageInfo: PageBasedInfo = data.datasets.byId?.metadata
                    .chain.blocks.pageInfo
                    ? Object.assign(
                          deepCopy(
                              data.datasets.byId?.metadata.chain.blocks
                                  .pageInfo,
                          ),
                          { currentPage: numPage },
                      )
                    : Object.assign(this.defaultPageInfo, {
                          currentPage: numPage,
                      });
                const historyUpdate: DatasetHistoryUpdate = {
                    history:
                        (data.datasets.byId?.metadata.chain.blocks
                            .nodes as MetadataBlockFragment[]) || [],
                    pageInfo: pageInfo,
                };
                this.appDatasetSubsService.changeDatasetHistory(historyUpdate);
            });
    }

    public onSearchMetadata(id: string, page: number): void {
        this.searchApi
            .onSearchMetadata({ id, page })
            .subscribe((data: GetDatasetMetadataSchemaQuery) => {
                if (isNil(data.datasets.byId)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    deepCopy<DatasetBasicsFragment>(data.datasets.byId);
                const schema: DataViewSchema = JSON.parse(
                    data.datasets.byId.metadata.currentSchema.content,
                );
                const metadata: DatasetMetadataDetailsFragment = deepCopy(
                    data.datasets.byId.metadata,
                );
                const pageInfo: PageBasedInfo = Object.assign(
                    this.defaultPageInfo,
                    {
                        currentPage: page,
                    },
                );
                const metadataSchemaUpdate: MetadataSchemaUpdate = {
                    schema,
                    pageInfo,
                    metadata,
                };
                this.appDatasetSubsService.metadataSchemaChanges(
                    metadataSchemaUpdate,
                );
                this.searchDatasetInfoChanges(dataset);
            });
    }
    public onGetDatasetDataSQLRun(
        currentDatasetInfo: DatasetBasicsFragment,
        query: string,
        limit: number,
    ): void {
        this.searchApi.onGetDatasetDataSQLRun({ query, limit }).subscribe(
            (data: GetDatasetDataSqlRunQuery) => {
                const dataset = {
                    metadata: {
                        currentSchema: {
                            content: {},
                        },
                    },
                    data: {
                        tail: {
                            content: [],
                        },
                    },
                } as any;
                dataset.data.tail.content = data.data?.query.data
                    ? JSON.parse(data.data?.query.data.content)
                    : "";
                dataset.metadata.currentSchema.content = data.data.query.schema
                    ? JSON.parse(data.data.query.schema.content)
                    : "";

                this.searchDatasetInfoChanges(dataset);

                const dataUpdate: DataUpdate = {
                    content: dataset.data.tail.content,
                    schema: dataset.metadata.currentSchema.content,
                };
                this.appDatasetSubsService.changeDatasetData(dataUpdate);
            },
            (error: { message: string }) => {
                this.modalService.error({
                    title: "Request was malformed.",
                    message: error.message,
                    yesButtonText: "Close",
                });
            },
        );
    }

    // TODO: What is the naming convention here exactly?
    public onSearchLineage(id: string): void {
        // TODO: Do we have to reset these when switching tabs?
        this.resetDatasetTree();
        this.resetKindInfo();

        this.searchApi
            .getDatasetLineage({ id })
            .subscribe((data: GetDatasetLineageQuery) => {
                if (isNil(data.datasets.byId)) {
                    throw new Error("Dataset not resolved by ID");
                }
                const dataset: DatasetBasicsFragment =
                    deepCopy<DatasetBasicsFragment>(data.datasets.byId);
                this.searchDatasetInfoChanges(dataset);

                this.updateDatasetTree(data);
            });
    }

    private updateDatasetTree(lineage: GetDatasetLineageQuery) {
        const tree: DatasetKindInterface[][] = [];
        const origin = lineage.datasets.byId;
        this.updateDatasetTreeRec(tree, origin);
        // @ts-ignore
        this.datasetTreeChange(tree, origin);
    }

    private updateDatasetTreeRec(tree: DatasetKindInterface[][], origin: any) {
        // TODO: Why is this needed to be called for every dataset in the graph?
        this.setKindInfo(origin);

        if (origin.metadata.currentDownstreamDependencies) {
            origin.metadata.currentDownstreamDependencies.forEach(
                (dep: any) => {
                    tree.push([
                        {
                            id: origin.id,
                            kind: origin.kind,
                            name: origin.name,
                        },
                        {
                            id: dep.id,
                            kind: dep.kind,
                            name: dep.name,
                        },
                    ]);
                    this.updateDatasetTreeRec(tree, dep);
                },
            );
        }
        if (origin.metadata.currentUpstreamDependencies) {
            origin.metadata.currentUpstreamDependencies.forEach((dep: any) => {
                tree.push([
                    {
                        id: dep.id,
                        kind: dep.kind,
                        name: dep.name,
                    },
                    {
                        id: origin.id,
                        kind: origin.kind,
                        name: origin.name,
                    },
                ]);
                this.updateDatasetTreeRec(tree, dep);
            });
        }
    }
}
