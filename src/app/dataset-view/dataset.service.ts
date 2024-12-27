import { SqlExecutionError } from "../common/errors";
import {
    DataQueryResultErrorKind,
    DataQueryResultSuccessViewFragment,
    DatasetByIdQuery,
    DatasetLineageBasicsFragment,
    DatasetLineageFragment,
    DatasetPageInfoFragment,
    DatasetPermissionsFragment,
    DependencyDatasetResultNotAccessible,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetLineageQuery,
    GetDatasetSchemaQuery,
    SetVocab,
} from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
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
    OverviewUpdate,
} from "./dataset.subscriptions.interface";
import { DatasetApi } from "../api/dataset.api";
import { DatasetNotFoundError } from "../common/errors";
import { map } from "rxjs/operators";
import { MaybeNull } from "../common/app.types";
import { parseCurrentSchema } from "../common/app.helpers";

@Injectable({ providedIn: "root" })
export class DatasetService {
    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);

    private currentSetVocab: SetVocab;
    private dataset$: Subject<DatasetBasicsFragment> = new Subject<DatasetBasicsFragment>();

    public get datasetChanges(): Observable<DatasetBasicsFragment> {
        return this.dataset$.asObservable();
    }

    public emitDatasetChanged(datasetInfo: DatasetBasicsFragment): void {
        this.dataset$.next(datasetInfo);
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
                        this.metadataTabDataUpdate(data, schema);
                        this.lineageDataReset();
                        this.historyDataReset();
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
                    this.emitDatasetChanged(datasetBasics);

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
                    this.emitDatasetChanged(dataset);
                    const pageInfo: DatasetPageInfoFragment = Object.assign(
                        {},
                        data.datasets.byOwnerAndName.metadata.chain.blocks.pageInfo,
                        { currentPage: numPage },
                    );
                    const historyUpdate: DatasetHistoryUpdate = {
                        history: data.datasets.byOwnerAndName.metadata.chain.blocks.nodes as MetadataBlockFragment[],
                        pageInfo,
                    };
                    this.datasetSubsService.emitHistoryChanged(historyUpdate);
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    private historyDataReset() {
        this.datasetSubsService.emitHistoryChanged(null);
    }

    public getDatasetHistory(info: DatasetInfo, numRecords: number, numPage: number): Observable<DatasetHistoryUpdate> {
        return this.datasetApi.getDatasetHistory({ ...info, numRecords, numPage }).pipe(
            map((data: GetDatasetHistoryQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataset: DatasetBasicsFragment = data.datasets.byOwnerAndName;
                    this.emitDatasetChanged(dataset);
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

    public requestDatasetLineage(info: DatasetInfo): Observable<void> {
        return this.datasetApi.getDatasetLineage({ ...info }).pipe(
            map((data: GetDatasetLineageQuery) => {
                if (data.datasets.byOwnerAndName) {
                    const dataset: DatasetBasicsFragment = data.datasets.byOwnerAndName;
                    this.emitDatasetChanged(dataset);
                    this.lineageTabDataUpdate(data.datasets.byOwnerAndName, data.datasets.byOwnerAndName);
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    public requestDatasetDataSqlRun(params: DatasetRequestBySql): Observable<void> {
        return this.datasetApi.getDatasetDataSqlRun(params).pipe(
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
                    this.datasetSubsService.emitSqlQueryDataChanged(dataUpdate);
                    this.datasetSubsService.resetSqlError();
                } else if (queryResult.errorKind === DataQueryResultErrorKind.InvalidSql) {
                    this.datasetSubsService.emitSqlErrorOccurred({
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
        this.emitDatasetChanged(data);
    }

    private overviewTabDataUpdate(
        overview: DatasetOverviewFragment,
        size: DatasetDataSizeFragment,
        schema: MaybeNull<DatasetSchema>,
        tail: DataQueryResultSuccessViewFragment,
    ): void {
        const content: DataRow[] = DatasetService.parseDataRows(tail);

        const overviewDataUpdate: OverviewUpdate = {
            schema,
            content,
            overview,
            size,
        };
        this.datasetSubsService.emitOverviewChanged(overviewDataUpdate);
    }

    private permissionsDataUpdate(permissions: DatasetPermissionsFragment): void {
        this.datasetSubsService.emitPermissionsChanged(permissions);
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
            this.datasetSubsService.emitMetadataSchemaChanged(metadataSchemaUpdate);
        }
    }

    private lineageTabDataUpdate(
        originDatasetBasics: DatasetLineageBasicsFragment,
        lineage: DatasetLineageFragment,
    ): void {
        const lineageResponse: DatasetLineageNode = this.lineageResponseFromRawQuery(originDatasetBasics, lineage);
        this.updateLineageGraph(lineageResponse);
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
                    basics:
                        downDependency.__typename === "DependencyDatasetResultAccessible"
                            ? (downDependency.dataset as DatasetLineageBasicsFragment)
                            : (downDependency as DependencyDatasetResultNotAccessible),
                    upstreamDependencies: [],
                    downstreamDependencies:
                        downDependency.__typename === "DependencyDatasetResultAccessible"
                            ? downDependency.dataset.metadata.currentDownstreamDependencies.map((downDependency2) => {
                                  return {
                                      basics:
                                          downDependency2.__typename === "DependencyDatasetResultAccessible"
                                              ? (downDependency2.dataset as DatasetLineageBasicsFragment)
                                              : (downDependency2 as DependencyDatasetResultNotAccessible),
                                      upstreamDependencies: [],
                                      downstreamDependencies:
                                          downDependency2.__typename === "DependencyDatasetResultAccessible"
                                              ? downDependency2.dataset.metadata.currentDownstreamDependencies.map(
                                                    (downDependency3) => {
                                                        return {
                                                            basics:
                                                                downDependency3.__typename ===
                                                                "DependencyDatasetResultAccessible"
                                                                    ? (downDependency3.dataset as DatasetLineageBasicsFragment)
                                                                    : (downDependency3 as DependencyDatasetResultNotAccessible),
                                                            upstreamDependencies: [],
                                                            downstreamDependencies:
                                                                downDependency3.__typename ===
                                                                "DependencyDatasetResultAccessible"
                                                                    ? downDependency3.dataset.metadata.currentDownstreamDependencies.map(
                                                                          (downDependency4) => {
                                                                              return {
                                                                                  basics:
                                                                                      downDependency4.__typename ===
                                                                                      "DependencyDatasetResultAccessible"
                                                                                          ? (downDependency4.dataset as DatasetLineageBasicsFragment)
                                                                                          : (downDependency4 as DependencyDatasetResultNotAccessible),
                                                                                  upstreamDependencies: [],
                                                                                  downstreamDependencies:
                                                                                      downDependency4.__typename ===
                                                                                      "DependencyDatasetResultAccessible"
                                                                                          ? downDependency4.dataset.metadata.currentDownstreamDependencies.map(
                                                                                                (downDependency5) => {
                                                                                                    return {
                                                                                                        basics:
                                                                                                            downDependency5.__typename ===
                                                                                                            "DependencyDatasetResultAccessible"
                                                                                                                ? (downDependency5.dataset as DatasetLineageBasicsFragment)
                                                                                                                : (downDependency5 as DependencyDatasetResultNotAccessible),
                                                                                                        upstreamDependencies:
                                                                                                            [],
                                                                                                        downstreamDependencies:
                                                                                                            [],
                                                                                                    };
                                                                                                },
                                                                                            )
                                                                                          : [],
                                                                              };
                                                                          },
                                                                      )
                                                                    : [],
                                                        };
                                                    },
                                                )
                                              : [],
                                  };
                              })
                            : [],
                };
            }),
            upstreamDependencies: originMetadata.currentUpstreamDependencies.map((upDependency) => {
                return {
                    basics:
                        upDependency.__typename === "DependencyDatasetResultAccessible"
                            ? (upDependency.dataset as DatasetLineageBasicsFragment)
                            : (upDependency as DependencyDatasetResultNotAccessible),
                    downstreamDependencies: [],
                    upstreamDependencies:
                        upDependency.__typename === "DependencyDatasetResultAccessible"
                            ? upDependency.dataset.metadata.currentUpstreamDependencies.map((upDependency2) => {
                                  return {
                                      basics:
                                          upDependency2.__typename === "DependencyDatasetResultAccessible"
                                              ? (upDependency2.dataset as DatasetLineageBasicsFragment)
                                              : (upDependency2 as DependencyDatasetResultNotAccessible),
                                      downstreamDependencies: [],
                                      upstreamDependencies:
                                          upDependency2.__typename === "DependencyDatasetResultAccessible"
                                              ? upDependency2.dataset.metadata.currentUpstreamDependencies.map(
                                                    (upDependency3) => {
                                                        return {
                                                            basics:
                                                                upDependency3.__typename ===
                                                                "DependencyDatasetResultAccessible"
                                                                    ? (upDependency3.dataset as DatasetLineageBasicsFragment)
                                                                    : (upDependency3 as DependencyDatasetResultNotAccessible),
                                                            downstreamDependencies: [],
                                                            upstreamDependencies:
                                                                upDependency3.__typename ===
                                                                "DependencyDatasetResultAccessible"
                                                                    ? upDependency3.dataset.metadata.currentUpstreamDependencies.map(
                                                                          (upDependency4) => {
                                                                              return {
                                                                                  basics:
                                                                                      upDependency4.__typename ===
                                                                                      "DependencyDatasetResultAccessible"
                                                                                          ? (upDependency4.dataset as DatasetLineageBasicsFragment)
                                                                                          : (upDependency4 as DependencyDatasetResultNotAccessible),
                                                                                  downstreamDependencies: [],
                                                                                  upstreamDependencies:
                                                                                      upDependency4.__typename ===
                                                                                      "DependencyDatasetResultAccessible"
                                                                                          ? upDependency4.dataset.metadata.currentUpstreamDependencies.map(
                                                                                                (upDependency5) => {
                                                                                                    return {
                                                                                                        basics:
                                                                                                            upDependency5.__typename ===
                                                                                                            "DependencyDatasetResultAccessible"
                                                                                                                ? (upDependency5.dataset as DatasetLineageBasicsFragment)
                                                                                                                : (upDependency5 as DependencyDatasetResultNotAccessible),
                                                                                                        downstreamDependencies:
                                                                                                            [],
                                                                                                        upstreamDependencies:
                                                                                                            [],
                                                                                                    };
                                                                                                },
                                                                                            )
                                                                                          : [],
                                                                              };
                                                                          },
                                                                      )
                                                                    : [],
                                                        };
                                                    },
                                                )
                                              : [],
                                  };
                              })
                            : [],
                };
            }),
        };
    }

    private updateLineageGraph(origin: DatasetLineageNode) {
        const lineageGraphEdges: DatasetLineageBasicsFragment[][] = [];
        const lineageGraphNodes: DatasetLineageBasicsFragment[] = [];

        this.updateLineageGraphRecords(origin, lineageGraphNodes, lineageGraphEdges);
        this.datasetSubsService.emitLineageChanged({
            origin: origin.basics as DatasetLineageBasicsFragment,
            nodes: lineageGraphNodes,
            edges: lineageGraphEdges,
        });
    }

    private lineageDataReset() {
        this.datasetSubsService.emitLineageChanged(null);
    }

    private updateLineageGraphRecords(
        currentNode: DatasetLineageNode,
        lineageGraphNodes: DatasetLineageBasicsFragment[],
        lineageGraphEdges: DatasetLineageBasicsFragment[][],
    ) {
        if (
            !lineageGraphNodes.some(
                (existingNode: DatasetLineageBasicsFragment) =>
                    existingNode.id === (currentNode.basics as DatasetLineageBasicsFragment).id,
            )
        ) {
            lineageGraphNodes.push(currentNode.basics as DatasetLineageBasicsFragment);
        }

        currentNode.downstreamDependencies.forEach((dependency: DatasetLineageNode) => {
            lineageGraphEdges.push([
                currentNode.basics as DatasetLineageBasicsFragment,
                dependency.basics as DatasetLineageBasicsFragment,
            ]);
            this.updateLineageGraphRecords(dependency, lineageGraphNodes, lineageGraphEdges);
        });

        currentNode.upstreamDependencies.forEach((dependency: DatasetLineageNode) => {
            lineageGraphEdges.push([
                dependency.basics as DatasetLineageBasicsFragment,
                currentNode.basics as DatasetLineageBasicsFragment,
            ]);
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
