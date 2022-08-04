import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetInfoInterface,
    DatasetKindInterface,
    DatasetNameInterface,
    SearchDatasetByID,
} from "../interface/search.interface";
import {
    DataQueries,
    DataSchema,
    DatasetKind,
    Datasets,
    GetDatasetLineageQuery, PageBasedInfo,
} from "../api/kamu.graphql.interface";
import AppValues from "../common/app.values";
import { ModalService } from "../components/modal/modal.service";
import {AppDatasetSubsService} from "./datasetSubs.service";
import {PaginationInfoInterface} from "./dataset-view.interface";
import * as _ from "lodash";

@Injectable()
export class AppDatasetService {
    public onSearchLinageDatasetSubscription: Subscription;

    constructor(
        private searchApi: SearchApi,
        private modalService: ModalService,
        private datasetOverviewService: AppDatasetSubsService
    ) {}

    public get onSearchDatasetInfoChanges(): Observable<DatasetInfoInterface> {
        return this.searchDatasetInfoChanges$.asObservable();
    }

    public get onSearchDatasetNameChanges(): Observable<DatasetNameInterface> {
        return this.searchDatasetNameChanges$.asObservable();
    }

    public get onSearchChanges(): Observable<string> {
        return this.searchChanges$.asObservable();
    }

    public get onKindInfoChanges(): Observable<DatasetKindInterface[]> {
        return this.kindInfoChanges$.asObservable();
    }

    public get onDatasetPageInfoChanges(): Observable<PaginationInfoInterface> {
        return this.datasetPageInfoChanges$.asObservable();
    }

    public get onDatasetTreeChanges(): Observable<
        [DatasetKindInterface[][], DatasetKindInterface]
    > {
        return this.datasetTreeChanges$.asObservable();
    }
    public get onDataSchemaChanges(): Observable<DataSchema> {
        return this.datasetSchemaChanges$.asObservable();
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
    private searchDatasetInfoChanges$: Subject<DatasetInfoInterface> = new Subject<DatasetInfoInterface>();
    private datasetPageInfoChanges$: Subject<PaginationInfoInterface> =
        new Subject<PaginationInfoInterface>();
    private searchDatasetNameChanges$: Subject<DatasetNameInterface> =
        new Subject<DatasetNameInterface>();
    private datasetTreeChanges$: Subject<
        [DatasetKindInterface[][], DatasetKindInterface]
    > = new Subject<[DatasetKindInterface[][], DatasetKindInterface]>();
    private datasetSchemaChanges$: Subject<DataSchema> =
        new Subject<DataSchema>();
    private datasetTree: DatasetKindInterface[][] = [];
    private datasetKindInfo: DatasetKindInterface[] = [];

    private static getDatasetInfo(
        byID: SearchDatasetByID,
    ): DatasetInfoInterface {
        return {
            id: byID.id,
            kind: byID.kind,
            name: byID.name,
            owner: byID.owner,
            __typename: byID.__typename,
            createdAt: byID.createdAt || "",
            lastUpdatedAt: byID.lastUpdatedAt || "",
            latestMetadataBlock: byID.latestMetadataBlock,
            numBlocksTotal: byID.numBlocksTotal,
            estimatedSize: byID.data ? byID.data.estimatedSize : 0,
            numRecordsTotal: byID.data ? byID.data.numRecordsTotal : 0,
            metadata: byID.metadata,
        };
    }
    public get defaultPageInfo(): PageBasedInfo {
        return {
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 1,
            currentPage: 1
        };
    }

    public searchDatasetInfoChanges(
        searchDatasetInfo: DatasetInfoInterface,
    ): void {
        this.searchDatasetInfoChanges$.next(searchDatasetInfo);
    }

    public searchDatasetNameChanges(
        searchDatasetName: DatasetNameInterface,
    ): void {
        this.searchDatasetNameChanges$.next(searchDatasetName);
    }
    public datasetPageInfoChanges(pageInfo: PaginationInfoInterface): void {
        this.datasetPageInfoChanges$.next(pageInfo);
    }
    public datasetSchemaChanges(schema: DataSchema): void {
        this.datasetSchemaChanges$.next(schema);
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
            .subscribe((data: {datasets: Datasets} | undefined) => {
                let datasets: SearchDatasetByID;
                if (!_.isNil(data)) {
                    /* eslint-disable  @typescript-eslint/no-explicit-any */
                    datasets = AppValues.deepCopy(data.datasets.byId);
                    datasets.data.tail.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets?.byId?.data.tail.data.content,
                          )
                        : ({} as any);
                    datasets.metadata.currentSchema.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets.byId.metadata.currentSchema.content,
                          )
                        : ({} as any);

                    this.searchDatasetNameChanges({
                        id: datasets.id,
                        name: datasets.name,
                        owner: datasets.owner,
                    });
                    const datasetInfo =
                        AppDatasetService.getDatasetInfo(datasets);
                    this.searchDatasetInfoChanges(datasetInfo);
                    this.datasetOverviewService.changeDatasetData(datasets.data.tail.content);
                    this.datasetSchemaChanges(
                        data.datasets.byId?.metadata
                            ?.currentSchema as DataSchema,
                    );
                }
            });
    }

    public getDatasetOverview(id: string, page: number): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: {datasets: Datasets} | undefined) => {
                let datasets: SearchDatasetByID;
                if (!_.isNil(data)) {
                    datasets = AppValues.deepCopy(data.datasets.byId);
                    datasets.latestMetadataBlock =
                        data.datasets.byId?.metadata.chain.blocks.nodes[0];
                    datasets.numBlocksTotal =
                        data.datasets.byId?.metadata.chain.blocks.totalCount ||
                        0;
                    datasets.data.tail.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets?.byId?.data.tail.data.content,
                          )
                        : ({} as any);
                    datasets.metadata.currentSchema.content = data.datasets.byId
                        ? JSON.parse(
                              data.datasets.byId.metadata.currentSchema.content,
                          )
                        : ({} as any);

                    this.searchDatasetNameChanges({
                        id: datasets.id,
                        name: datasets.name,
                        owner: datasets.owner,
                    });
                    const datasetInfo =
                        AppDatasetService.getDatasetInfo(datasets);
                    this.searchDatasetInfoChanges(datasetInfo);
                    this.datasetOverviewService.changeDatasetOverview(datasets.data.tail.content);
                }
            });
    }

    public onDatasetHistorySchema(
        id: string,
        numRecords: number,
        numPage: number,
    ): void {
        this.searchApi
            .onDatasetHistory({id, numRecords, numPage})
            .subscribe((data: { datasets: Datasets } | undefined) => {
                let pageInfo: PaginationInfoInterface = Object.assign(this.defaultPageInfo, {
                    page: numPage,
                });

                if (!_.isNil(data)) {
                    pageInfo = data.datasets.byId?.metadata.chain.blocks
                        .pageInfo
                        ? Object.assign(
                            AppValues.deepCopy(
                                data.datasets.byId?.metadata.chain.blocks
                                    .pageInfo,
                            ),
                            {page: numPage},
                        )
                        : Object.assign(this.defaultPageInfo, {
                            page: numPage,
                        });

                    this.searchDatasetNameChanges({
                        id: data.datasets.byId?.id,
                        name: data.datasets.byId?.name,
                        owner: data.datasets.byId?.owner as any,
                    });
                    this.datasetOverviewService.changeDatasetHistory(data.datasets.byId?.metadata.chain.blocks.nodes || []);
                } else {
                    this.datasetOverviewService.changeDatasetHistory([]);
                }
                this.datasetPageInfoChanges(pageInfo);
            });
    }

    public onSearchMetadata(id: string, page: number): void {
        this.searchApi
            .onSearchMetadata({ id, page })
            .subscribe((data: { datasets: Datasets } | undefined) => {
                let datasets: SearchDatasetByID;
                if (!_.isNil(data)) {
                    datasets = AppValues.deepCopy(data.datasets.byId);
                    this.searchDatasetNameChanges({
                        id: datasets.id,
                        name: datasets.name,
                        owner: datasets.owner,
                    });
                    this.datasetSchemaChanges(
                        data.datasets.byId?.metadata
                            ?.currentSchema as DataSchema,
                    );
                    const datasetInfo =
                        AppDatasetService.getDatasetInfo(datasets);
                    this.searchDatasetInfoChanges(datasetInfo);
                    // @ts-ignore
                    this.datasetOverviewService.changeDatasetMetadata(datasets.metadata.chain.blocks.nodes);
                }
            });
    }
    public onGetDatasetDataSQLRun(
        currentDatasetInfo: DatasetInfoInterface,
        query: string,
        limit: number,
    ): void {
        this.searchApi.onGetDatasetDataSQLRun({ query, limit }).subscribe(
            (data: {data: DataQueries} | undefined) => {
                const datasets = {
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
                if (!_.isNil(data)) {
                    datasets.data.tail.content = data.data?.query.data
                        ? JSON.parse(data.data?.query.data.content)
                        : "";
                    datasets.metadata.currentSchema.content = data.data.query.schema
                        ? JSON.parse(data.data.query.schema.content)
                        : "";

                    const datasetInfo: DatasetInfoInterface = AppDatasetService.getDatasetInfo(
                        Object.assign(currentDatasetInfo, datasets),
                    );
                    this.searchDatasetInfoChanges(datasetInfo);
                    this.datasetOverviewService.changeDatasetDataSQL(datasets.data.tail.content);
                    this.datasetSchemaChanges(
                        data.data.query.schema as DataSchema,
                    );
                }
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
            .subscribe((result: { datasets: Datasets } | undefined) => {
                if (!_.isNil(result)) {
                    this.searchDatasetNameChanges({
                        id: result.datasets.byId?.id,
                        name: result.datasets.byId?.name,
                        owner: result.datasets.byId?.owner as any,
                    });
                    this.updateDatasetTree(result);
                }
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
