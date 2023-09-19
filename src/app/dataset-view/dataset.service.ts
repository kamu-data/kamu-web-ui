import { SqlExecutionError } from "../common/errors";
import {
    DataQueryResultErrorKind,
    DataQueryResultSuccessViewFragment,
    DatasetByIdQuery,
    DatasetLineageBasicsFragment,
    DatasetLineageFragment,
    DatasetPageInfoFragment,
    DatasetPermissionsFragment,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetSchemaQuery,
    SetVocab,
} from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { DataRow, DatasetLineageNode, DatasetRequestBySql, DatasetSchema } from "../interface/dataset.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    GetDatasetDataSqlRunQuery,
    GetDatasetHistoryQuery,
    GetDatasetMainDataQuery,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import {
    DatasetHistoryUpdate,
    DataUpdate,
    MetadataSchemaUpdate,
    OverviewDataUpdate,
} from "./dataset.subscriptions.interface";
import { DatasetApi } from "../api/dataset.api";
import { DatasetNotFoundError } from "../common/errors";
import { catchError, map } from "rxjs/operators";
import { MaybeNull } from "../common/app.types";
import { parseCurrentSchema } from "../common/app.helpers";

@Injectable({ providedIn: "root" })
export class DatasetService {
    constructor(private datasetApi: DatasetApi, private datasetSubsService: DatasetSubscriptionsService) {}

    private currentSetVocab: SetVocab;

    private datasetChanges$: Subject<DatasetBasicsFragment> = new Subject<DatasetBasicsFragment>();

    public get onDatasetChanges(): Observable<DatasetBasicsFragment> {
        return this.datasetChanges$.asObservable();
    }

    public datasetChanges(datasetInfo: DatasetBasicsFragment): void {
        this.datasetChanges$.next(datasetInfo);
    }

    public requestDatasetMainData(info: DatasetInfo): Observable<void> {
        return this.datasetApi.getDatasetMainData(info).pipe(
            map((data: GetDatasetMainDataQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataTail = data.datasets.byOwnerAndName.data.tail;
                    if (dataTail.__typename === "DataQueryResultSuccess") {
                        const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                            data.datasets.byOwnerAndName.metadata.currentSchema,
                        );
                        this.datasetUpdate(data.datasets.byOwnerAndName);
                        this.overviewTabDataUpdate(
                            data.datasets.byOwnerAndName,
                            data.datasets.byOwnerAndName.data,
                            schema,
                            dataTail,
                        );
                        this.permissionsDataUpdate(data.datasets.byOwnerAndName);
                        this.currentSetVocab = data.datasets.byOwnerAndName.metadata.currentVocab as SetVocab;
                        this.dataTabDataUpdate(schema, dataTail, this.currentSetVocab);
                        this.metadataTabDataUpdate(data, schema);
                        this.lineageTabDataUpdate(data.datasets.byOwnerAndName, data.datasets.byOwnerAndName);
                    } else {
                        throw new SqlExecutionError(dataTail.errorMessage);
                    }
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public requestDatasetBasicDataWithPermissions(info: DatasetInfo): Observable<void> {
        return this.datasetApi.getDatasetBasicsWithPermissions(info).pipe(
            map((data: GetDatasetBasicsWithPermissionsQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const datasetBasics: DatasetBasicsFragment = data.datasets.byOwnerAndName;
                    this.datasetChanges(datasetBasics);

                    const datasetPermissions: DatasetPermissionsFragment = data.datasets.byOwnerAndName;
                    this.permissionsDataUpdate(datasetPermissions);
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public requestDatasetHistory(info: DatasetInfo, numRecords: number, numPage: number): Observable<void> {
        return this.datasetApi.getDatasetHistory({ ...info, numRecords, numPage }).pipe(
            map((data: GetDatasetHistoryQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataset: DatasetBasicsFragment = data.datasets.byOwnerAndName;
                    this.datasetChanges(dataset);
                    const pageInfo: DatasetPageInfoFragment = Object.assign(
                        {},
                        data.datasets.byOwnerAndName.metadata.chain.blocks.pageInfo,
                        { currentPage: numPage },
                    );
                    const historyUpdate: DatasetHistoryUpdate = {
                        history: data.datasets.byOwnerAndName.metadata.chain.blocks.nodes as MetadataBlockFragment[],
                        pageInfo,
                    };
                    this.datasetSubsService.changeDatasetHistory(historyUpdate);
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public getDatasetHistory(info: DatasetInfo, numRecords: number, numPage: number): Observable<DatasetHistoryUpdate> {
        return this.datasetApi.getDatasetHistory({ ...info, numRecords, numPage }).pipe(
            map((data: GetDatasetHistoryQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataset: DatasetBasicsFragment = data.datasets.byOwnerAndName;
                    this.datasetChanges(dataset);
                    const pageInfo: DatasetPageInfoFragment = Object.assign(
                        {},
                        data.datasets.byOwnerAndName.metadata.chain.blocks.pageInfo,
                        { currentPage: numPage },
                    );
                    const historyUpdate: DatasetHistoryUpdate = {
                        history: data.datasets.byOwnerAndName.metadata.chain.blocks.nodes as MetadataBlockFragment[],
                        pageInfo,
                    };
                    return historyUpdate;
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public requestDatasetDataSqlRun(params: DatasetRequestBySql): Observable<void> {
        return this.datasetApi.getDatasetDataSqlRun(params).pipe(
            catchError(() => throwError(() => new SqlExecutionError())),
            map((result: GetDatasetDataSqlRunQuery) => {
                const queryResult = result.data.query;
                if (queryResult.__typename === "DataQueryResultSuccess") {
                    const content: DataRow[] = DatasetService.parseDataRows(queryResult);
                    const schema: MaybeNull<DatasetSchema> = queryResult.schema
                        ? DatasetService.parseSchema(queryResult.schema.content)
                        : null;

                    const dataUpdate: DataUpdate = {
                        content,
                        schema,
                        currentVocab: this.currentSetVocab,
                    };
                    this.datasetSubsService.changeDatasetData(dataUpdate);
                    this.datasetSubsService.observeSqlErrorOccurred({
                        error: "",
                    });
                } else if (queryResult.errorKind === DataQueryResultErrorKind.InvalidSql) {
                    this.datasetSubsService.observeSqlErrorOccurred({
                        error: queryResult.errorMessage,
                    });
                } else {
                    throw new SqlExecutionError(queryResult.errorMessage);
                }
            }),
        );
    }

    public requestDatasetInfoById(datasetId: string): Observable<DatasetByIdQuery> {
        return this.datasetApi.getDatasetInfoById(datasetId);
    }

    public requestDatasetSchema(datasetId: string): Observable<GetDatasetSchemaQuery> {
        return this.datasetApi.getDatasetSchema(datasetId);
    }

    private datasetUpdate(data: DatasetBasicsFragment): void {
        this.datasetChanges(data);
    }

    private overviewTabDataUpdate(
        overview: DatasetOverviewFragment,
        size: DatasetDataSizeFragment,
        schema: MaybeNull<DatasetSchema>,
        tail: DataQueryResultSuccessViewFragment,
    ): void {
        const content: DataRow[] = DatasetService.parseDataRows(tail);

        const overviewDataUpdate: OverviewDataUpdate = {
            schema,
            content,
            overview,
            size,
        };
        this.datasetSubsService.changeDatasetOverviewData(overviewDataUpdate);
    }

    private permissionsDataUpdate(permissions: DatasetPermissionsFragment): void {
        this.datasetSubsService.changePermissionsData(permissions);
    }

    private dataTabDataUpdate(
        schema: MaybeNull<DatasetSchema>,
        tail: DataQueryResultSuccessViewFragment,
        currentVocab?: SetVocab,
    ): void {
        const content: DataRow[] = DatasetService.parseDataRows(tail);
        const dataUpdate: DataUpdate = { content, schema, currentVocab };
        this.datasetSubsService.changeDatasetData(dataUpdate);
    }

    private metadataTabDataUpdate(data: GetDatasetMainDataQuery, schema: MaybeNull<DatasetSchema>): void {
        if (data.datasets.byOwnerAndName) {
            const metadata: DatasetMetadataSummaryFragment = data.datasets.byOwnerAndName;

            const pageInfo: DatasetPageInfoFragment = {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            };
            const metadataSchemaUpdate: MetadataSchemaUpdate = {
                schema,
                pageInfo,
                metadataSummary: metadata,
            };
            this.datasetSubsService.metadataSchemaChanges(metadataSchemaUpdate);
        }
    }

    private lineageTabDataUpdate(
        originDatasetBasics: DatasetLineageBasicsFragment,
        lineage: DatasetLineageFragment,
    ): void {
        const lineageResponse: DatasetLineageNode = this.lineageResponseFromRawQuery(originDatasetBasics, lineage);
        this.updatelineageGraph(lineageResponse);
    }

    private lineageResponseFromRawQuery(
        originDatasetBasics: DatasetLineageBasicsFragment,
        lineage: DatasetLineageFragment,
    ): DatasetLineageNode {
        const originMetadata = lineage.metadata;
        return {
            basics: originDatasetBasics,
            downstreamDependencies: originMetadata.currentDownstreamDependencies.map((downDependency) => {
                return {
                    basics: downDependency as DatasetLineageBasicsFragment,
                    downstreamDependencies: downDependency.metadata.currentDownstreamDependencies.map(
                        (downDependency2) => {
                            return {
                                basics: downDependency2 as DatasetLineageBasicsFragment,
                                downstreamDependencies: downDependency2.metadata.currentDownstreamDependencies.map(
                                    (downDependency3) => {
                                        return {
                                            basics: downDependency3 as DatasetLineageBasicsFragment,
                                            downstreamDependencies:
                                                downDependency3.metadata.currentDownstreamDependencies.map(
                                                    (downDependency4) => {
                                                        return {
                                                            basics: downDependency4 as DatasetLineageBasicsFragment,
                                                            downstreamDependencies:
                                                                downDependency4.metadata.currentDownstreamDependencies.map(
                                                                    (downDependency5) => {
                                                                        return {
                                                                            basics: downDependency5 as DatasetLineageBasicsFragment,
                                                                            downstreamDependencies: [],
                                                                            upstreamDependencies: [],
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
                                upstreamDependencies: [],
                            };
                        },
                    ),
                    upstreamDependencies: [],
                };
            }),
            upstreamDependencies: originMetadata.currentUpstreamDependencies.map((upDependency) => {
                return {
                    basics: upDependency as DatasetLineageBasicsFragment,
                    downstreamDependencies: [],
                    upstreamDependencies: upDependency.metadata.currentUpstreamDependencies.map((upDependency2) => {
                        return {
                            basics: upDependency2 as DatasetLineageBasicsFragment,
                            downstreamDependencies: [],
                            upstreamDependencies: upDependency2.metadata.currentUpstreamDependencies.map(
                                (upDependency3) => {
                                    return {
                                        basics: upDependency3 as DatasetLineageBasicsFragment,
                                        downstreamDependencies: [],
                                        upstreamDependencies: upDependency3.metadata.currentUpstreamDependencies.map(
                                            (upDependency4) => {
                                                return {
                                                    basics: upDependency4 as DatasetLineageBasicsFragment,
                                                    downstreamDependencies: [],
                                                    upstreamDependencies:
                                                        upDependency4.metadata.currentUpstreamDependencies.map(
                                                            (upDependency5) => {
                                                                return {
                                                                    basics: upDependency5 as DatasetLineageBasicsFragment,
                                                                    downstreamDependencies: [],
                                                                    upstreamDependencies: [],
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
                    }),
                };
            }),
        };
    }

    private updatelineageGraph(origin: DatasetLineageNode) {
        const lineageGraphEdges: DatasetLineageBasicsFragment[][] = [];
        const lineageGraphNodes: DatasetLineageBasicsFragment[] = [];

        this.updateLineageGraphRecords(origin, lineageGraphNodes, lineageGraphEdges);
        this.datasetSubsService.changeLineageData({
            origin: origin.basics,
            nodes: lineageGraphNodes,
            edges: lineageGraphEdges,
        });
    }

    private updateLineageGraphRecords(
        currentNode: DatasetLineageNode,
        lineageGraphNodes: DatasetLineageBasicsFragment[],
        lineageGraphEdges: DatasetLineageBasicsFragment[][],
    ) {
        if (
            !lineageGraphNodes.some(
                (existingNode: DatasetLineageBasicsFragment) => existingNode.id === currentNode.basics.id,
            )
        ) {
            lineageGraphNodes.push(currentNode.basics);
        }

        currentNode.downstreamDependencies.forEach((dependency: DatasetLineageNode) => {
            lineageGraphEdges.push([currentNode.basics, dependency.basics]);
            this.updateLineageGraphRecords(dependency, lineageGraphNodes, lineageGraphEdges);
        });

        currentNode.upstreamDependencies.forEach((dependency: DatasetLineageNode) => {
            lineageGraphEdges.push([dependency.basics, currentNode.basics]);
            this.updateLineageGraphRecords(dependency, lineageGraphNodes, lineageGraphEdges);
        });
    }

    private static parseDataRows(successResult: DataQueryResultSuccessViewFragment): DataRow[] {
        const content: string = successResult.data.content;
        return JSON.parse(content) as DataRow[];
    }

    private static parseSchema(schemaContent: string): DatasetSchema {
        return JSON.parse(schemaContent) as DatasetSchema;
    }
}
