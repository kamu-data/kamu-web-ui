import {
    DatasetVisibility,
    DatasetVisibilityInput,
    SetVisibilityDatasetMutation,
    DatasetSystemTimeBlockByHashGQL,
    DatasetSystemTimeBlockByHashQuery,
    UpdateWatermarkGQL,
} from "./kamu.graphql.interface";
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
    SetVisibilityDatasetGQL,
    DatasetHeadBlockHashGQL,
    DatasetHeadBlockHashQuery,
    DatasetPushSyncStatusesGQL,
    DatasetPushSyncStatusesQuery,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import { ApolloQueryResult } from "@apollo/client/core";
import { inject, Injectable } from "@angular/core";
import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";
import { MutationResult } from "apollo-angular";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { DatasetOperationError } from "../common/values/errors";
import { StoreObject } from "@apollo/client/cache";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { resetCacheHelper, updateCacheHelper } from "../common/helpers/apollo-cache.helper";

@Injectable({ providedIn: "root" })
export class DatasetApi {
    private datasetMainDataGQL = inject(GetDatasetMainDataGQL);
    private datasetBasicsWithPermissionGQL = inject(GetDatasetBasicsWithPermissionsGQL);
    private datasetDataSqlRunGQL = inject(GetDatasetDataSqlRunGQL);
    private datasetHistoryGQL = inject(GetDatasetHistoryGQL);
    private datasetsByAccountNameGQL = inject(DatasetsByAccountNameGQL);
    private metadataBlockGQL = inject(GetMetadataBlockGQL);
    private datasetByIdGQL = inject(DatasetByIdGQL);
    private datasetByAccountAndDatasetNameGQL = inject(DatasetByAccountAndDatasetNameGQL);
    private createEmptyDatasetGQL = inject(CreateEmptyDatasetGQL);
    private createDatasetFromSnapshotGQL = inject(CreateDatasetFromSnapshotGQL);
    private commitEventToDatasetGQL = inject(CommitEventToDatasetGQL);
    private datasetSchemaGQL = inject(GetDatasetSchemaGQL);
    private updateReadmeGQL = inject(UpdateReadmeGQL);
    private deleteDatasetGQL = inject(DeleteDatasetGQL);
    private renameDatasetGQL = inject(RenameDatasetGQL);
    private datasetLineageGQL = inject(GetDatasetLineageGQL);
    private updateWatermarkGQL = inject(UpdateWatermarkGQL);
    private setVisibilityDatasetGQL = inject(SetVisibilityDatasetGQL);
    private datasetHeadBlockHashGQL = inject(DatasetHeadBlockHashGQL);
    private datasetSystemTimeBlockByHashGQL = inject(DatasetSystemTimeBlockByHashGQL);
    private datasetPushSyncStatusesGQL = inject(DatasetPushSyncStatusesGQL);

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

    public getSystemTimeBlockByHash(
        datasetId: string,
        blockHash: string,
    ): Observable<DatasetSystemTimeBlockByHashQuery> {
        return this.datasetSystemTimeBlockByHashGQL
            .watch({
                datasetId,
                blockHash,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetSystemTimeBlockByHashQuery>) => {
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

    public createDatasetFromSnapshot(params: {
        snapshot: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<CreateDatasetFromSnapshotMutation> {
        return this.createDatasetFromSnapshotGQL.mutate({ ...params }).pipe(
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

    public createEmptyDataset(params: {
        datasetKind: DatasetKind;
        datasetAlias: string;
        datasetVisibility: DatasetVisibility;
    }): Observable<CreateEmptyDatasetMutation> {
        return this.createEmptyDatasetGQL
            .mutate({
                ...params,
            })
            .pipe(
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
            .mutate({
                datasetId: params.datasetId,
                event: params.event,
            })
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
            .mutate({
                datasetId: params.datasetId,
                content: params.content,
            })
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
                        resetCacheHelper(cache, params);
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
            .mutate({
                datasetId: params.datasetId,
                watermark: params.watermark,
            })
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

    public setVisibilityDataset(params: {
        accountId: string;
        datasetId: string;
        visibility: DatasetVisibilityInput;
    }): Observable<SetVisibilityDatasetMutation> {
        return this.setVisibilityDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    visibility: params.visibility,
                },
                {
                    update: (cache) => {
                        updateCacheHelper(cache, {
                            accountId: params.accountId,
                            datasetId: params.datasetId,
                            fieldNames: ["visibility"],
                        });
                    },
                },
            )
            .pipe(
                first(),
                map((result: MutationResult<SetVisibilityDatasetMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public datasetHeadBlockHash(accountName: string, datasetName: string): Observable<DatasetHeadBlockHashQuery> {
        return this.datasetHeadBlockHashGQL
            .watch(
                { accountName, datasetName },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetHeadBlockHashQuery>) => {
                    return result.data;
                }),
            );
    }

    public datasetPushSyncStatuses(datasetId: string): Observable<DatasetPushSyncStatusesQuery> {
        return this.datasetPushSyncStatusesGQL
            .watch(
                { datasetId },

                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetPushSyncStatusesQuery>) => {
                    return result.data;
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
