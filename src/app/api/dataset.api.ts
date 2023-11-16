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
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";

import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";

import { MutationResult } from "apollo-angular";
import { DatasetRequestBySql } from "../interface/dataset.interface";
import { DatasetOperationError } from "../common/errors";

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
            .watch({ query: params.query, limit: params.limit ?? AppValues.SQL_QUERY_LIMIT, skip: params.skip })
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

    public createEmptyDataset(datasetKind: DatasetKind, datasetName: string): Observable<CreateEmptyDatasetMutation> {
        return this.createEmptyDatasetGQL.mutate({ datasetKind, datasetName }).pipe(
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
        accountName: string;
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
                        cache.evict({
                            id: DatasetApi.CREATE_DATASET_SELETOR(params.datasetId, params.accountName),
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
        accountName: string;
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
                        cache.evict({
                            id: DatasetApi.CREATE_DATASET_SELETOR(params.datasetId, params.accountName),
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

    public deleteDataset(params: { accountName: string; datasetId: string }): Observable<DeleteDatasetMutation> {
        return this.deleteDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                },
                {
                    update: (cache) => {
                        cache.evict({
                            id: DatasetApi.CREATE_DATASET_SELETOR(params.datasetId, params.accountName),
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
        accountName: string;
        datasetId: string;
        newName: string;
    }): Observable<RenameDatasetMutation> {
        return this.renameDatasetGQL
            .mutate(
                {
                    datasetId: params.datasetId,
                    newName: params.newName,
                },
                {
                    update: (cache) => {
                        cache.evict({
                            id: DatasetApi.CREATE_DATASET_SELETOR(params.datasetId, params.accountName),
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

    private static readonly CREATE_DATASET_SELETOR = (datasetId: string, accountName: string): string => {
        const owner = `{"owner":{"__ref":"Account:{\\"accountName\\":\\"${accountName}\\"}"}`;
        const id = `"id":"${datasetId}"}`;

        return `Dataset:${owner},${id}`;
    };
}
