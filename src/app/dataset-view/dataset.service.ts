/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable, Injector } from "@angular/core";

import { combineLatest, Observable, of, ReplaySubject, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { APOLLO_OPTIONS } from "apollo-angular";

import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { resetCacheHelper } from "@common/helpers/apollo-cache.helper";
import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { parseDataRows } from "@common/helpers/data.helpers";
import { DatasetNotFoundError, SqlExecutionError } from "@common/values/errors";
import { DatasetApi } from "@api/dataset.api";
import {
    BlockRef,
    CompareChainsResultStatus,
    CompareChainsStatus,
    DataQueryResultSuccessViewFragment,
    DatasetBasicsFragment,
    DatasetByIdQuery,
    DatasetDataSizeFragment,
    DatasetHeadBlockHashQuery,
    DatasetLineageBasicsFragment,
    DatasetLineageFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    DatasetPageInfoFragment,
    DatasetPermissionsFragment,
    DatasetPushSyncStatusesQuery,
    DependencyDatasetResultNotAccessible,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetHistoryQuery,
    GetDatasetLineageQuery,
    GetDatasetMainDataQuery,
    GetDatasetSchemaQuery,
    MetadataBlockFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetSchema } from "@interface/dataset-schema.interface";
import { DatasetLineageNode } from "@interface/dataset.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import {
    DatasetHistoryUpdate,
    MetadataSchemaUpdate,
    OverviewUpdate,
} from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Injectable({ providedIn: "root" })
export class DatasetService {
    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private injector = inject(Injector);
    private currentHeadBlockHash: string;
    private dataset$: Subject<DatasetBasicsFragment> = new ReplaySubject<DatasetBasicsFragment>(1);

    public get datasetChanges(): Observable<DatasetBasicsFragment> {
        return this.dataset$.asObservable();
    }

    public emitDatasetChanged(datasetInfo: DatasetBasicsFragment): void {
        this.dataset$.next(datasetInfo);
    }

    private downstreamsCount$: Subject<number> = new ReplaySubject(1 /*bufferSize*/);

    public emitDownstreamsCountChanged(count: number): void {
        this.downstreamsCount$.next(count);
    }

    public get downstreamsCountChanges(): Observable<number> {
        return this.downstreamsCount$.asObservable();
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
                        this.metadataTabDataUpdate(data, schema);
                        this.lineageDataReset();
                        this.historyDataReset();
                        this.setHeadBlockHash(data.datasets.byOwnerAndName.metadata.chain.refs as BlockRef[]);

                        this.emitDownstreamsCountChanged(
                            data.datasets.byOwnerAndName.metadata.currentDownstreamDependencies.length,
                        );
                    } else {
                        throw new SqlExecutionError(dataTail.errorMessage);
                    }
                } else {
                    const cache = this.injector.get(APOLLO_OPTIONS).cache;
                    cache.evict({
                        id: "ROOT_QUERY",
                        fieldName: "datasets",
                    });
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
                    this.lineageTabDataUpdate(data.datasets.byOwnerAndName, data.datasets.byOwnerAndName);
                } else {
                    throw new DatasetNotFoundError();
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

    public hasOutOfSyncPushRemotes(datasetId: string): Observable<boolean> {
        return this.datasetApi.datasetPushSyncStatuses(datasetId).pipe(
            map((data: DatasetPushSyncStatusesQuery) => {
                const statuses = data.datasets.byId?.metadata.pushSyncStatuses.statuses ?? [];
                return statuses.some((status) => {
                    if (status.result.__typename === "CompareChainsResultStatus") {
                        const result: CompareChainsResultStatus = status.result;
                        if (result.message !== CompareChainsStatus.Equal) {
                            return true;
                        }
                    } else if (status.result.__typename === "CompareChainsResultError") {
                        return true;
                    }
                    return false;
                });
            }),
        );
    }

    public requestListDownstreams(datasetId: string): Observable<string[]> {
        return this.datasetApi.datasetListDownstreams(datasetId).pipe(
            map((data) => {
                const list = data.datasets.byId?.metadata.currentDownstreamDependencies.map((downstream) => {
                    if (downstream.__typename === "DependencyDatasetResultAccessible") {
                        return `${downstream.dataset.owner.accountName}/${downstream.dataset.name}`;
                    }
                });
                return list as string[];
            }),
        );
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
        const content: DynamicTableDataRow[] = parseDataRows(tail);

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
            const metadataSummary: DatasetMetadataSummaryFragment = data.datasets.byOwnerAndName;

            const pageInfo: DatasetPageInfoFragment = {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            };
            const metadataSchemaUpdate: MetadataSchemaUpdate = {
                schema,
                pageInfo,
                metadataSummary,
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
}
