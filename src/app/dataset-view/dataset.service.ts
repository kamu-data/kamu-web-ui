import { SqlExecutionError } from "./../common/errors";
import {
    DataQuerySuccessResultViewFragment,
    DatasetLineageFragment,
    DatasetPageInfoFragment,
} from "./../api/kamu.graphql.interface";
import { DatasetInfo } from "./../interface/navigation.interface";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import {
    DataRow,
    DatasetLineageNode,
    DatasetSchema,
} from "../interface/dataset.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    GetDatasetMainDataQuery,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { AppDatasetSubscriptionsService } from "./dataset.subscriptions.service";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { DatasetApi } from "../api/dataset.api";
import { DatasetNotFoundError } from "../common/errors";
import { catchError, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class DatasetService {
    constructor(
        private datasetApi: DatasetApi,
        private appDatasetSubsService: AppDatasetSubscriptionsService,
    ) {}

    private datasetChanges$: Subject<DatasetBasicsFragment> =
        new Subject<DatasetBasicsFragment>();

    public get onDatasetChanges(): Observable<DatasetBasicsFragment> {
        return this.datasetChanges$.asObservable();
    }

    public datasetChanges(searchDatasetInfo: DatasetBasicsFragment): void {
        this.datasetChanges$.next(searchDatasetInfo);
    }

    public requestDatasetMainData(info: DatasetInfo): Observable<void> {
        return this.datasetApi.getDatasetMainData(info).pipe(
            map((data: GetDatasetMainDataQuery) => {
                if (data.datasets.byOwnerAndName) {
                    this.datasetUpdate(data.datasets.byOwnerAndName);
                    this.overviewTabDataUpdate(data);
                    this.dataTabDataUpdate(data);
                    this.metadataTabDataUpdate(data);
                    this.lineageTabDataUpdate(
                        data.datasets.byOwnerAndName,
                        data.datasets.byOwnerAndName,
                    );
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public requestDatasetHistory(
        info: DatasetInfo,
        numRecords: number,
        numPage: number,
    ): Observable<void> {
        return this.datasetApi
            .getDatasetHistory({ ...info, numRecords, numPage })
            .pipe(
                map((data: GetDatasetHistoryQuery) => {
                    if (data.datasets.byOwnerAndName) {
                        const dataset: DatasetBasicsFragment =
                            data.datasets.byOwnerAndName;
                        this.datasetChanges(dataset);
                        const pageInfo: DatasetPageInfoFragment = Object.assign(
                            {},
                            data.datasets.byOwnerAndName.metadata.chain.blocks
                                .pageInfo,
                            { currentPage: numPage },
                        );
                        const historyUpdate: DatasetHistoryUpdate = {
                            history: data.datasets.byOwnerAndName.metadata.chain
                                .blocks.nodes as MetadataBlockFragment[],
                            pageInfo,
                        };
                        this.appDatasetSubsService.changeDatasetHistory(
                            historyUpdate,
                        );
                    } else {
                        throw new DatasetNotFoundError();
                    }
                }),
            );
    }

    public requestDatasetDataSqlRun(
        query: string,
        limit: number,
    ): Observable<void> {
        return this.datasetApi.getDatasetDataSqlRun({ query, limit }).pipe(
            catchError(() => throwError(new SqlExecutionError())),
            map((result: GetDatasetDataSqlRunQuery) => {
                const queryResult = result.data.query;
                if (queryResult.__typename === "DataQuerySuccessResult") {
                    const content: DataRow[] = DatasetService.parseDataRows(queryResult);
                    const schema: DatasetSchema = DatasetService.parseSchema(queryResult.schema.content);
                    const dataUpdate: DataUpdate = { content, schema };
                    this.appDatasetSubsService.changeDatasetData(dataUpdate);
                } else if (queryResult.__typename === "DataQueryInvalidSqlResult") {
                    this.appDatasetSubsService.observeSqlErrorOccurred({
                        error: queryResult.error
                    });
                } else {
                    throw new SqlExecutionError(queryResult.error);
                }
            })
        );
    }

    private datasetUpdate(data: DatasetBasicsFragment): void {
        const dataset: DatasetBasicsFragment = data;
        this.datasetChanges(dataset);
    }

    private overviewTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const tail = data.datasets.byOwnerAndName.data.tail;
            if (tail.__typename === "DataQuerySuccessResult") {
                const content: DataRow[] = DatasetService.parseDataRows(tail);
                const overview: DatasetOverviewFragment = data.datasets.byOwnerAndName;
                const size: DatasetDataSizeFragment = data.datasets.byOwnerAndName.data;

                const overviewDataUpdate: OverviewDataUpdate = {
                    content,
                    overview,
                    size,
                };
                this.appDatasetSubsService.changeDatasetOverviewData(
                    overviewDataUpdate,
                );                
            } else {
                throw new SqlExecutionError(tail.error);
            }
        }
    }

    private dataTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const dataset = data.datasets.byOwnerAndName;
            const tail = dataset.data.tail;
            if (tail.__typename === "DataQuerySuccessResult") {
                const content: DataRow[] =  DatasetService.parseDataRows(tail);
                const schema: DatasetSchema = DatasetService.parseSchema(dataset.metadata.currentSchema.content);
                const dataUpdate: DataUpdate = { content, schema };
                this.appDatasetSubsService.changeDatasetData(dataUpdate);
            } else {
                throw new SqlExecutionError(tail.error);
            }
        }
    }

    private metadataTabDataUpdate(data: GetDatasetMainDataQuery): void {
        if (data.datasets.byOwnerAndName) {
            const schemaMetadata: DatasetSchema = JSON.parse(
                data.datasets.byOwnerAndName.metadata.currentSchema.content,
            ) as DatasetSchema;
            const metadata: DatasetMetadataSummaryFragment =
                data.datasets.byOwnerAndName;

            const pageInfo: DatasetPageInfoFragment = {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            };
            const metadataSchemaUpdate: MetadataSchemaUpdate = {
                schema: schemaMetadata,
                pageInfo,
                metadata,
            };
            this.appDatasetSubsService.metadataSchemaChanges(
                metadataSchemaUpdate,
            );
        }
    }

    private lineageTabDataUpdate(
        originDatasetBasics: DatasetBasicsFragment,
        lineage: DatasetLineageFragment,
    ): void {
        const lineageResponse: DatasetLineageNode =
            this.lineageResponseFromRawQuery(originDatasetBasics, lineage);
        this.updatelineageGraph(lineageResponse);
    }

    private lineageResponseFromRawQuery(
        originDatasetBasics: DatasetBasicsFragment,
        lineage: DatasetLineageFragment,
    ): DatasetLineageNode {
        const originMetadata = lineage.metadata;
        return {
            basics: originDatasetBasics,
            downstreamDependencies:
                originMetadata.currentDownstreamDependencies.map(
                    (downDependency) => {
                        return {
                            basics: downDependency as DatasetBasicsFragment,
                            downstreamDependencies:
                                downDependency.metadata.currentDownstreamDependencies.map(
                                    (downDependency2) => {
                                        return {
                                            basics: downDependency2 as DatasetBasicsFragment,
                                            downstreamDependencies:
                                                downDependency2.metadata.currentDownstreamDependencies.map(
                                                    (downDependency3) => {
                                                        return {
                                                            basics: downDependency3 as DatasetBasicsFragment,
                                                            downstreamDependencies:
                                                                downDependency3.metadata.currentDownstreamDependencies.map(
                                                                    (
                                                                        downDependency4,
                                                                    ) => {
                                                                        return {
                                                                            basics: downDependency4 as DatasetBasicsFragment,
                                                                            downstreamDependencies:
                                                                                downDependency4.metadata.currentDownstreamDependencies.map(
                                                                                    (
                                                                                        downDependency5,
                                                                                    ) => {
                                                                                        return {
                                                                                            basics: downDependency5 as DatasetBasicsFragment,
                                                                                            downstreamDependencies:
                                                                                                [],
                                                                                            upstreamDependencies:
                                                                                                [],
                                                                                        };
                                                                                    },
                                                                                ),
                                                                            upstreamDependencies:
                                                                                [],
                                                                        };
                                                                    },
                                                                ),
                                                            upstreamDependencies:
                                                                [],
                                                        };
                                                    },
                                                ),
                                            upstreamDependencies: [],
                                        };
                                    },
                                ),
                            upstreamDependencies: [],
                        };
                    },
                ),
            upstreamDependencies:
                originMetadata.currentUpstreamDependencies.map(
                    (upDependency) => {
                        return {
                            basics: upDependency as DatasetBasicsFragment,
                            downstreamDependencies: [],
                            upstreamDependencies:
                                upDependency.metadata.currentUpstreamDependencies.map(
                                    (upDependency2) => {
                                        return {
                                            basics: upDependency2 as DatasetBasicsFragment,
                                            downstreamDependencies: [],
                                            upstreamDependencies:
                                                upDependency2.metadata.currentUpstreamDependencies.map(
                                                    (upDependency3) => {
                                                        return {
                                                            basics: upDependency3 as DatasetBasicsFragment,
                                                            downstreamDependencies:
                                                                [],
                                                            upstreamDependencies:
                                                                upDependency3.metadata.currentUpstreamDependencies.map(
                                                                    (
                                                                        upDependency4,
                                                                    ) => {
                                                                        return {
                                                                            basics: upDependency4 as DatasetBasicsFragment,
                                                                            downstreamDependencies:
                                                                                [],
                                                                            upstreamDependencies:
                                                                                upDependency4.metadata.currentUpstreamDependencies.map(
                                                                                    (
                                                                                        upDependency5,
                                                                                    ) => {
                                                                                        return {
                                                                                            basics: upDependency5 as DatasetBasicsFragment,
                                                                                            downstreamDependencies:
                                                                                                [],
                                                                                            upstreamDependencies:
                                                                                                [],
                                                                                        };
                                                                                    },
                                                                                ),
                                                                        };
                                                                    },
                                                                ),
                                                        };
                                                    },
                                                ),
                                        };
                                    },
                                ),
                        };
                    },
                ),
        };
    }

    private updatelineageGraph(origin: DatasetLineageNode) {
        const lineageGraphEdges: DatasetBasicsFragment[][] = [];
        const lineageGraphNodes: DatasetBasicsFragment[] = [];

        this.updateLineageGraphRecords(
            origin,
            lineageGraphNodes,
            lineageGraphEdges,
        );
        this.appDatasetSubsService.changeLineageData({
            origin: origin.basics,
            nodes: lineageGraphNodes,
            edges: lineageGraphEdges,
        });
    }

    private updateLineageGraphRecords(
        currentNode: DatasetLineageNode,
        lineageGraphNodes: DatasetBasicsFragment[],
        lineageGraphEdges: DatasetBasicsFragment[][],
    ) {
        if (
            !lineageGraphNodes.some(
                (existingNode: DatasetBasicsFragment) =>
                    existingNode.id === currentNode.basics.id,
            )
        ) {
            lineageGraphNodes.push(currentNode.basics);
        }

        currentNode.downstreamDependencies.forEach(
            (dependency: DatasetLineageNode) => {
                lineageGraphEdges.push([currentNode.basics, dependency.basics]);
                this.updateLineageGraphRecords(
                    dependency,
                    lineageGraphNodes,
                    lineageGraphEdges,
                );
            },
        );

        currentNode.upstreamDependencies.forEach(
            (dependency: DatasetLineageNode) => {
                lineageGraphEdges.push([dependency.basics, currentNode.basics]);
                this.updateLineageGraphRecords(
                    dependency,
                    lineageGraphNodes,
                    lineageGraphEdges,
                );
            },
        );
    }

    private static parseDataRows(successResult: DataQuerySuccessResultViewFragment): DataRow[] {
        const content: string = successResult.data.content;
        return JSON.parse(content) as DataRow[];
    }

    private static parseSchema(schemaContent: string): DatasetSchema {
        return JSON.parse(schemaContent) as DatasetSchema;
    }
}
