import {
    CommitEventToDatasetGQL,
    CommitEventToDatasetQuery,
    CreateDatasetFromSnapshotGQL,
    CreateDatasetFromSnapshotQuery,
    CreateEmptyDatasetQuery,
    DatasetKind,
    GetDatasetSchemaGQL,
    GetDatasetSchemaQuery,
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

@Injectable({ providedIn: "root" })
export class DatasetApi {
    constructor(
        private datasetMainDataGQL: GetDatasetMainDataGQL,
        private datasetDataSqlRunGQL: GetDatasetDataSqlRunGQL,
        private datasetHistoryGQL: GetDatasetHistoryGQL,
        private datasetsByAccountNameGQL: DatasetsByAccountNameGQL,
        private metadataBlockGQL: GetMetadataBlockGQL,
        private datasetByIdGQL: DatasetByIdGQL,
        private createEmptyDatasetGQL: CreateEmptyDatasetGQL,
        private createDatasetFromSnapshotGQL: CreateDatasetFromSnapshotGQL,
        private commitEventToDataset: CommitEventToDatasetGQL,
        private datasetSchemaGQL: GetDatasetSchemaGQL,
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

    public createDatasetFromSnapshot(
        accountId: string,
        snapshot: string,
    ): Observable<CreateDatasetFromSnapshotQuery> {
        return this.createDatasetFromSnapshotGQL
            .watch({ accountId, snapshot })
            .valueChanges.pipe(
                first(),
                map(
                    (
                        result: ApolloQueryResult<CreateDatasetFromSnapshotQuery>,
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
    ): Observable<CreateEmptyDatasetQuery> {
        return this.createEmptyDatasetGQL
            .watch({ accountId, datasetKind, datasetName })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<CreateEmptyDatasetQuery>) => {
                    return result.data;
                }),
            );
    }

    public commitEvent(params: {
        accountName: string;
        datasetName: string;
        event: string;
    }): Observable<CommitEventToDatasetQuery> {
        return this.commitEventToDataset
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                event: params.event,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<CommitEventToDatasetQuery>) => {
                    return result.data;
                }),
            );
    }
}
