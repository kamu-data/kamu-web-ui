import { SqlExecutionError } from "../common/errors";
import {
    BlockRef,
    DataQueryResultErrorKind,
    DataQueryResultSuccessViewFragment,
    DatasetByIdQuery,
    DatasetHeadBlockHashQuery,
    DatasetLineageBasicsFragment,
    DatasetLineageFragment,
    DatasetPageInfoFragment,
    DatasetPermissionsFragment,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetLineageQuery,
    GetDatasetSchemaQuery,
    SetVocab,
} from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { inject, Injectable, Injector } from "@angular/core";
import { combineLatest, Observable, of, Subject } from "rxjs";
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
import { APOLLO_OPTIONS } from "apollo-angular";
import { resetCacheHelper } from "../apollo-cache.helper";

@Injectable({ providedIn: "root" })
export class DatasetService {
    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private injector = inject(Injector);
    private currentSetVocab: SetVocab;
    private currentHeadBlockHash: string;
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
                        this.setHeadBlockHash(data.datasets.byOwnerAndName.metadata.chain.refs as BlockRef[]);
                    } else {
                        throw new SqlExecutionError(dataTail.errorMessage);
                    }
                } else {
                    throw new DatasetNotFoundError();
                }
            }),
        );
    }

    private setHeadBlockHash(refs: BlockRef[]): void {
        const head = refs?.find((item) => item.name === "head");
        this.currentHeadBlockHash = head?.blockHash ?? "";
    }

    public isHeadHashBlockChanged(datasetBasics: DatasetBasicsFragment): Observable<boolean> {
        return combineLatest([
            this.requestDatasetHeadBlockHash(datasetBasics.owner.accountName, datasetBasics.name),
            of(this.currentHeadBlockHash),
        ]).pipe(
            map(([newHeadBlockHash, currentHeadBlockHash]) => {
                if (currentHeadBlockHash !== newHeadBlockHash) {
                    this.resetCache(datasetBasics);
                    return true;
                }
                return false;
            }),
        );
    }

    private resetCache(datasetBasics: DatasetBasicsFragment): void {
        const cache = this.injector.get(APOLLO_OPTIONS).cache;
        resetCacheHelper(cache, { accountId: datasetBasics.owner.id, datasetId: datasetBasics.id });
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

    public requestDatasetHeadBlockHash(accountName: string, datasetName: string): Observable<string> {
        return this.datasetApi.datasetHeadBlockHash(accountName, datasetName).pipe(
            map((data: DatasetHeadBlockHashQuery) => {
                const refs = data.datasets.byOwnerAndName?.metadata.chain.refs;
                const head = refs?.find((item) => item.name === "head");
                return head?.blockHash ?? "";
            }),
        );
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

    private updateLineageGraph(origin: DatasetLineageNode) {
        const lineageGraphEdges: DatasetLineageBasicsFragment[][] = [];
        const lineageGraphNodes: DatasetLineageBasicsFragment[] = [];

        this.updateLineageGraphRecords(origin, lineageGraphNodes, lineageGraphEdges);
        this.datasetSubsService.emitLineageChanged({
            origin: origin.basics,
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
