import { UpdateWatermarkGQL } from "./kamu.graphql.interface";
import {
    CommitEventToDatasetGQL,
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotGQL,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetByAccountAndDatasetNameGQL,
    DatasetByAccountAndDatasetNameQuery,
    DatasetKind,
    DeleteDatasetGQL,
    DeleteDatasetMutation,
    GetDatasetBasicsWithPermissionsGQL,
    GetDatasetSchemaGQL,
    GetDatasetSchemaQuery,
    RenameDatasetGQL,
    RenameDatasetMutation,
    UpdateReadmeGQL,
    UpdateReadmeMutation,
    GetDatasetMainDataGQL,
    GetDatasetMainDataQuery,
    GetDatasetHistoryGQL,
    GetDatasetHistoryQuery,
    GetDatasetDataSqlRunGQL,
    GetDatasetDataSqlRunQuery,
    DatasetsByAccountNameGQL,
    DatasetsByAccountNameQuery,
    GetMetadataBlockGQL,
    GetMetadataBlockQuery,
    DatasetByIdQuery,
    DatasetByIdGQL,
    CreateEmptyDatasetGQL,
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetLineageQuery,
    GetDatasetLineageGQL,
    UpdateWatermarkMutation,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";
import { MutationResult } from "apollo-angular";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { DatasetOperationError } from "../common/errors";
import { StoreObject } from "@apollo/client/cache";
import { noCacheFetchPolicy } from "../common/data.helpers";
import { updateCacheHelper } from "../apollo-cache.helper";

@Injectable({ providedIn: "root" })
export class DatasetApi {
    constructor(
        private datasetMainDataGQL: GetDatasetMainDataGQL,
        private datasetBasicsWithPermissionGQL: GetDatasetBasicsWithPermissionsGQL,
        private datasetDataSqlRunGQL: GetDatasetDataSqlRunGQL,
        private datasetHistoryGQL: GetDatasetHistoryGQL,
        private datasetsByAccountNameGQL: DatasetsByAccountNameGQL,
        private metadataBlockGQL: GetMetadataBlockGQL,
        private datasetByIdGQL: DatasetByIdGQL,
        private datasetByAccountAndDatasetNameGQL: DatasetByAccountAndDatasetNameGQL,
        private createEmptyDatasetGQL: CreateEmptyDatasetGQL,
        private createDatasetFromSnapshotGQL: CreateDatasetFromSnapshotGQL,
        private commitEventToDatasetGQL: CommitEventToDatasetGQL,
        private datasetSchemaGQL: GetDatasetSchemaGQL,
        private updateReadmeGQL: UpdateReadmeGQL,
        private deleteDatasetGQL: DeleteDatasetGQL,
        private renameDatasetGQL: RenameDatasetGQL,
        private datasetLineageGQL: GetDatasetLineageGQL,
        private updateWatermarkGQL: UpdateWatermarkGQL,
    ) {}

    public getDatasetMainData(params: {
        accountName: string;
        datasetName: string;
        numRecords?: number;
    }): Observable<GetDatasetMainDataQuery> {
        return this.datasetMainDataGQL
            .watch(
                {
                    accountName: params.accountName,
                    datasetName: params.datasetName,
                    limit: params.numRecords ?? AppValues.SAMPLE_DATA_LIMIT,
                },
                {
                    fetchPolicy: "cache-first",
                    errorPolicy: "all",
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetMainDataQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetDataSqlRun(params: DatasetRequestBySql): Observable<GetDatasetDataSqlRunQuery> {
        return this.datasetDataSqlRunGQL
            .watch(
                { query: params.query, limit: params.limit ?? AppValues.SQL_QUERY_LIMIT, skip: params.skip },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetDataSqlRunQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetBasicsWithPermissions(params: {
        accountName: string;
        datasetName: string;
    }): Observable<GetDatasetBasicsWithPermissionsQuery> {
        return this.datasetBasicsWithPermissionGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetBasicsWithPermissionsQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetHistory(params: {
        accountName: string;
        datasetName: string;
        numRecords: number;
        numPage: number;
    }): Observable<GetDatasetHistoryQuery> {
        return this.datasetHistoryGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                perPage: params.numRecords,
                page: params.numPage,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetHistoryQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetLineage(params: { accountName: string; datasetName: string }): Observable<GetDatasetLineageQuery> {
        return this.datasetLineageGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetLineageQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetSchema(datasetId: string): Observable<GetDatasetSchemaQuery> {
        return this.datasetSchemaGQL
            .watch({
                datasetId,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetSchemaQuery>) => {
                    return result.data;
                }),
            );
    }

    public fetchDatasetsByAccountName(
        accountName: string,
        page = 0,
        perPage = 10,
    ): Observable<DatasetsByAccountNameQuery> {
        return this.datasetsByAccountNameGQL.watch({ accountName, perPage, page }).valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<DatasetsByAccountNameQuery>) => {
                return result.data;
            }),
        );
    }

    public getBlockByHash(params: {
        accountName: string;
        datasetName: string;
        blockHash: string;
    }): Observable<GetMetadataBlockQuery> {
        return this.metadataBlockGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                blockHash: params.blockHash,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetMetadataBlockQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetInfoById(datasetId: string): Observable<DatasetByIdQuery> {
        return this.datasetByIdGQL
            .watch({
                datasetId,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetByIdQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetInfoByAccountAndDatasetName(
        accountName: string,
        datasetName: string,
    ): Observable<DatasetByAccountAndDatasetNameQuery> {
        return this.datasetByAccountAndDatasetNameGQL
            .watch({
                accountName,
                datasetName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetByAccountAndDatasetNameQuery>) => {
                    return result.data;
                }),
            );
    }

    public createDatasetFromSnapshot(snapshot: string): Observable<CreateDatasetFromSnapshotMutation> {
        return this.createDatasetFromSnapshotGQL.mutate({ snapshot }).pipe(
            first(),
            map((result: MutationResult<CreateDatasetFromSnapshotMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }

    public createEmptyDataset(datasetKind: DatasetKind, datasetAlias: string): Observable<CreateEmptyDatasetMutation> {
        return this.createEmptyDatasetGQL.mutate({ datasetKind, datasetAlias }).pipe(
            first(),
            map((result: MutationResult<CreateEmptyDatasetMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }

    public commitEvent(params: {
        accountId: string;
        datasetId: string;
        event: string;
    }): Observable<CommitEventToDatasetMutation> {
        return this.commitEventToDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    event: params.event,
                },
                {
                    update: (cache) => {
                        // New events affect metadata chain in unpredictable manner
                        // Open question: future impact on "data" field, if new event brings schema evolution
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["metadata"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<CommitEventToDatasetMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public updateReadme(params: {
        accountId: string;
        datasetId: string;
        content: string;
    }): Observable<UpdateReadmeMutation> {
        return this.updateReadmeGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    content: params.content,
                },
                {
                    update: (cache) => {
                        // Note: dropping readme on its own via `cache.modify` could have been an option,
                        // but any change to readme affects the state of the metadata chain nodes,
                        // so dropping metadata field completely is a valid and safe option
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["metadata"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<UpdateReadmeMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public deleteDataset(params: { accountId: string; datasetId: string }): Observable<DeleteDatasetMutation> {
        return this.deleteDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                },
                {
                    update: (cache) => {
                        // Drop entire dataset object
                        const datasetKeyFragment = DatasetApi.generateDatasetKeyFragment(
                            cache.identify(DatasetApi.generateAccountKeyFragment(params.accountId)),
                            params.datasetId,
                        );
                        cache.evict({
                            id: cache.identify(datasetKeyFragment),
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<DeleteDatasetMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public renameDataset(params: {
        datasetId: string;
        newName: string;
        accountId: string;
    }): Observable<RenameDatasetMutation> {
        return this.renameDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    newName: params.newName,
                },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["alias", "name"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<RenameDatasetMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public setWatermark(params: {
        datasetId: string;
        watermark: string;
        accountId: string;
    }): Observable<UpdateWatermarkMutation> {
        return this.updateWatermarkGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    watermark: params.watermark,
                },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["metadata"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<UpdateWatermarkMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public static generateDatasetKeyFragment(ownerRef: string | undefined, datasetId: string): StoreObject {
        return {
            __typename: "Dataset",
            owner: {
                __ref: ownerRef,
            },
            id: datasetId,
        };
    }

    public static generateAccountKeyFragment(accountId: string): StoreObject {
        return {
            __typename: "Account",
            id: accountId,
        };
    }
}
