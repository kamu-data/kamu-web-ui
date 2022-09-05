import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";

import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";

import {
    DatasetOverviewGQL,
    DatasetOverviewQuery,
    GetDatasetDataSchemaGQL,
    GetDatasetDataSchemaQuery,
    GetDatasetHistoryGQL,
    GetDatasetHistoryQuery,
    GetDatasetMetadataSchemaGQL,
    GetDatasetDataSqlRunGQL,
    GetDatasetDataSqlRunQuery,
    GetDatasetLineageGQL,
    GetDatasetLineageQuery,
    GetDatasetMetadataSchemaQuery,
} from "./kamu.graphql.interface";

@Injectable()
export class DatasetApi {
    constructor(
        private datasetOverviewGQL: DatasetOverviewGQL,
        private datasetMetadataGQL: GetDatasetMetadataSchemaGQL,
        private getDatasetDataSchemaGQL: GetDatasetDataSchemaGQL,
        private getDatasetDataSQLRun: GetDatasetDataSqlRunGQL,
        private getDatasetHistoryGQL: GetDatasetHistoryGQL,
        private getDatasetLineageGQL: GetDatasetLineageGQL,
    ) {}

    public getDatasetOverview(params: {
        accountName: string;
        datasetName: string;
        numRecords?: number;
    }): Observable<DatasetOverviewQuery> {
        return this.datasetOverviewGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                limit: params.numRecords ?? 10,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<DatasetOverviewQuery>) => {
                    return result.data;
                }),
            );
    }
    public onGetDatasetDataSQLRun(params: {
        query: string;
        limit: number;
    }): Observable<GetDatasetDataSqlRunQuery> {
        return this.getDatasetDataSQLRun
            .watch({ query: params.query, limit: params.limit })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetDataSqlRunQuery>) => {
                    return result.data;
                }),
            );
    }
    public onDatasetHistory(params: {
        accountName: string;
        datasetName: string;
        numRecords: number;
        numPage: number;
    }): Observable<GetDatasetHistoryQuery> {
        return this.getDatasetHistoryGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                perPage: params.numRecords || 10,
                page: params.numPage || 0,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetHistoryQuery>) => {
                    return result.data;
                }),
            );
    }
    public getDatasetDataSchema(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<GetDatasetDataSchemaQuery> {
        return this.getDatasetDataSchemaGQL
            .watch({
                datasetId: params.id,
                numRecords: params.numRecords ?? 10,
                numPage: params.page ?? 0,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<GetDatasetDataSchemaQuery>) => {
                    return result.data;
                }),
            );
    }

    public onSearchMetadata(params: {
        accountName: string;
        datasetName: string;
        numRecords?: number;
        page?: number;
    }): Observable<GetDatasetMetadataSchemaQuery> {
        return this.datasetMetadataGQL
            .watch({
                accountName: params.accountName,
                datasetName: params.datasetName,
                numPage: 0,
                numRecords: 1,
            })
            .valueChanges.pipe(
                first(),
                map(
                    (
                        result: ApolloQueryResult<GetDatasetMetadataSchemaQuery>,
                    ) => {
                        return result.data;
                    },
                ),
            );
    }

    public getDatasetLineage(params: {
        accountName: string;
        datasetName: string;
    }): Observable<GetDatasetLineageQuery> {
        return this.getDatasetLineageGQL
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
}
