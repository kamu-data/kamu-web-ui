import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetKindInterface,
    DatasetNameInterface,
    SearchHistoryInterface,
} from "../interface/search.interface";
import {
    DataSchema,
    Dataset,
    DatasetKind,
    DatasetOverviewQuery,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetLineageQuery,
    GetDatasetMetadataSchemaQuery,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import AppValues from "../common/app.values";
import { ModalService } from "../components/modal/modal.service";
import { AppDatasetSubsService } from "./datasetSubs.service";
import { PaginationInfoInterface } from "./dataset-view.interface";

@Injectable()
export class AppDatasetService {
    public onSearchLineageDatasetSubscription: Subscription;

    constructor(
        private searchApi: SearchApi,
        private modalService: ModalService,
        private appDatasetSubsService: AppDatasetSubsService,
    ) {}

    public get onSearchDatasetInfoChanges(): Observable<Dataset> {
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
    private searchDatasetInfoChanges$: Subject<Dataset> =
        new Subject<Dataset>();
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

    private static parseContentOfDataset(
        data: DatasetOverviewQuery,
    ): SearchHistoryInterface[] {
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

    public searchDatasetInfoChanges(searchDatasetInfo: Dataset): void {
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
            .subscribe((data: DatasetOverviewQuery) => {
                const dataset: Dataset = AppValues.deepCopy(data.datasets.byId);
                const content: SearchHistoryInterface[] =
                    AppDatasetService.parseContentOfDataset(data);
                this.searchDatasetNameChanges({
                    id: dataset.id,
                    name: dataset.name,
                    owner: dataset.owner,
                });
                // TODO: split searchDatasetInfoChanges Subject for Overview nd Metadata
                this.searchDatasetInfoChanges(dataset);

                this.appDatasetSubsService.changeDatasetData(content);
                this.datasetSchemaChanges(
                    data.datasets.byId?.metadata?.currentSchema as DataSchema,
                );
            });
    }

    public getDatasetOverview(id: string, page: number): void {
        this.searchApi
            .getDatasetOverview({ id, page })
            .subscribe((data: DatasetOverviewQuery) => {
                const dataset: Dataset = AppValues.deepCopy(data.datasets.byId);
                const content: SearchHistoryInterface[] =
                    AppDatasetService.parseContentOfDataset(data);
                this.searchDatasetNameChanges({
                    id: dataset.id,
                    name: dataset.name,
                    owner: dataset.owner,
                });
                this.searchDatasetInfoChanges(dataset);

                // TODO: split changeDatasetData Subject for Overview nd Metadata
                this.appDatasetSubsService.changeDatasetOverview(content);
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
                let pageInfo: PaginationInfoInterface = Object.assign(
                    this.defaultPageInfo,
                    {
                        page: numPage,
                    },
                );

                pageInfo = data.datasets.byId?.metadata.chain.blocks.pageInfo
                    ? Object.assign(
                          AppValues.deepCopy(
                              data.datasets.byId?.metadata.chain.blocks
                                  .pageInfo,
                          ),
                          { page: numPage },
                      )
                    : Object.assign(this.defaultPageInfo, {
                          page: numPage,
                      });

                this.searchDatasetNameChanges({
                    id: data.datasets.byId?.id,
                    name: data.datasets.byId?.name,
                    owner: data.datasets.byId?.owner as any,
                });
                this.appDatasetSubsService.changeDatasetHistory(
                    (data.datasets.byId?.metadata.chain.blocks
                        .nodes as MetadataBlockFragment[]) || [],
                );
                this.datasetPageInfoChanges(pageInfo);
            });
    }

    public onSearchMetadata(id: string, page: number): void {
        this.searchApi
            .onSearchMetadata({ id, page })
            .subscribe((data: GetDatasetMetadataSchemaQuery) => {
                let dataset: Dataset = AppValues.deepCopy(data.datasets.byId);
                this.searchDatasetNameChanges({
                    id: dataset.id,
                    name: dataset.name,
                    owner: dataset.owner,
                });
                this.datasetSchemaChanges(
                    data.datasets.byId?.metadata?.currentSchema as DataSchema,
                );
                this.searchDatasetInfoChanges(dataset);

                // TODO: Should be refactoring
                this.appDatasetSubsService.changeDatasetMetadata(
                    // @ts-ignore
                    dataset.metadata.chain.blocks.nodes,
                );
            });
    }
    public onGetDatasetDataSQLRun(
        currentDatasetInfo: Dataset,
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
                this.appDatasetSubsService.changeDatasetData(
                    dataset.data.tail.content,
                );
                this.datasetSchemaChanges(data.data.query.schema as DataSchema);
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
            .subscribe((result: GetDatasetLineageQuery) => {
                this.searchDatasetNameChanges({
                    id: result.datasets.byId?.id,
                    name: result.datasets.byId?.name,
                    owner: result.datasets.byId?.owner as any,
                });
                this.updateDatasetTree(result);
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
