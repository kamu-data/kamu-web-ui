import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";

import { map, first } from "rxjs/operators";
import { Observable } from "rxjs";

import {
    GetDatasetMainDataGQL,
    GetDatasetMainDataQuery,
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
        private datasetMainDataGQL: GetDatasetMainDataGQL,
        private datasetMetadataGQL: GetDatasetMetadataSchemaGQL,
        private datasetDataSqlRunGQL: GetDatasetDataSqlRunGQL,
        private datasetHistoryGQL: GetDatasetHistoryGQL,
        private datasetLineageGQL: GetDatasetLineageGQL,
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
                limit: params.numRecords ?? 10,
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

    public getDatasetMetadata(params: {
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
}
