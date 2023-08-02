import {
    CommitEventToDatasetGQL,
    CommitEventToDatasetMutation,
    CreateDatasetFromSnapshotGQL,
    CreateDatasetFromSnapshotMutation,
    CreateEmptyDatasetMutation,
    DatasetByAccountAndDatasetNameGQL,
    DatasetByAccountAndDatasetNameQuery,
    DatasetKind,
    GetDatasetSchemaGQL,
    GetDatasetSchemaQuery,
    UpdateReadmeGQL,
    UpdateReadmeMutation,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";

import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";

import {
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
} from "./kamu.graphql.interface";
import { MutationResult } from "apollo-angular";

@Injectable({ providedIn: "root" })
export class DatasetApi {
    constructor(
        private datasetMainDataGQL: GetDatasetMainDataGQL,
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
    ) {}

    public getDatasetMainData(params: {
        accountName: string;
        datasetName: string;
        numRecords?: number;
    }): Observable<GetDatasetMainDataQuery> {
        return this.datasetMainDataGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                limit: params.numRecords ?? AppValues.SQL_QUERY_LIMIT,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetMainDataQuery>) => {
                    return result.data;
                }),
            );
    }

    public getDatasetDataSqlRun(params: {
        query: string;
        limit: number;
    }): Observable<GetDatasetDataSqlRunQuery> {
        return this.datasetDataSqlRunGQL
            .watch({ query: params.query, limit: params.limit })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetDataSqlRunQuery>) => {
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

    public getDatasetSchema(
        datasetId: string,
    ): Observable<GetDatasetSchemaQuery> {
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
        return this.datasetsByAccountNameGQL
            .watch({ accountName, perPage, page })
            .valueChanges.pipe(
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
                map(
                    (
                        result: ApolloQueryResult<DatasetByAccountAndDatasetNameQuery>,
                    ) => {
                        return result.data;
                    },
                ),
            );
    }

    public createDatasetFromSnapshot(
        accountId: string,
        snapshot: string,
    ): Observable<CreateDatasetFromSnapshotMutation | undefined | null> {
        return this.createDatasetFromSnapshotGQL
            .mutate({ accountId, snapshot })
            .pipe(
                first(),
                map(
                    (
                        result: MutationResult<CreateDatasetFromSnapshotMutation>,
                    ) => {
                        return result.data;
                    },
                ),
            );
    }

    public createEmptyDataset(
        accountId: string,
        datasetKind: DatasetKind,
        datasetName: string,
    ): Observable<CreateEmptyDatasetMutation | null | undefined> {
        return this.createEmptyDatasetGQL
            .mutate({ accountId, datasetKind, datasetName })
            .pipe(
                first(),
                map((result: MutationResult<CreateEmptyDatasetMutation>) => {
                    return result.data;
                }),
            );
    }

    public commitEvent(params: {
        datasetId: string;
        event: string;
    }): Observable<CommitEventToDatasetMutation | null | undefined> {
        return this.commitEventToDatasetGQL
            .mutate({
                datasetId: params.datasetId,
                event: params.event,
            })
            .pipe(
                first(),
                map((result: MutationResult<CommitEventToDatasetMutation>) => {
                    return result.data;
                }),
            );
    }

    public updateReadme(
        datasetId: string,
        content: string,
    ): Observable<UpdateReadmeMutation | null | undefined> {
        return this.updateReadmeGQL
            .mutate({
                datasetId,
                content,
            })
            .pipe(
                first(),
                map((result: MutationResult<UpdateReadmeMutation>) => {
                    return result.data;
                }),
            );
    }
}
