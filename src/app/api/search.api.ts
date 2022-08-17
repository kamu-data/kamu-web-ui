import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ApolloQueryResult } from "apollo-client";
import { map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { DatasetIDsInterface, TypeNames } from "../interface/search.interface";

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
    SearchDatasetsAutocompleteGQL,
    SearchDatasetsOverviewGQL,
    GetDatasetLineageGQL,
    GetDatasetLineageQuery,
    SearchDatasetsOverviewQuery,
    PageBasedInfo,
    SearchDatasetsAutocompleteQuery,
    GetDatasetMetadataSchemaQuery,
} from "./kamu.graphql.interface";

@Injectable()
export class SearchApi {
    constructor(
        private apollo: Apollo,
        private datasetOverviewGQL: DatasetOverviewGQL,
        private datasetMetadataGQL: GetDatasetMetadataSchemaGQL,
        private searchDatasetsAutocompleteGQL: SearchDatasetsAutocompleteGQL,
        private searchDatasetsOverviewGQL: SearchDatasetsOverviewGQL,
        private getDatasetDataSchemaGQL: GetDatasetDataSchemaGQL,
        private getDatasetDataSQLRun: GetDatasetDataSqlRunGQL,
        private getDatasetHistoryGQL: GetDatasetHistoryGQL,
        private getDatasetLineageGQL: GetDatasetLineageGQL,
    ) {}

    public pageInfoInit(): PageBasedInfo {
        return {
            hasNextPage: false,
            hasPreviousPage: false,
            totalPages: 0,
            currentPage: 0,
        };
    }

    // Search query that returns high-level dataset information for displaying the dataset badge
    public searchOverview(
        searchQuery: string,
        page = 0,
        perPage = 10,
    ): Observable<SearchDatasetsOverviewQuery> {
        return this.searchDatasetsOverviewGQL
            .watch({
                query: searchQuery,
                perPage,
                page,
            })
            .valueChanges.pipe(
                map(
                    (
                        result: ApolloQueryResult<SearchDatasetsOverviewQuery>,
                    ) => {
                        return result.data;
                    },
                ),
            );
    }

    public autocompleteDatasetSearch(
        id: string,
    ): Observable<DatasetIDsInterface[]> {
        if (id === "") {
            return of([]);
        }

        return this.searchDatasetsAutocompleteGQL
            .watch({ query: id, perPage: 10 })
            .valueChanges.pipe(
                map(
                    (
                        result: ApolloQueryResult<SearchDatasetsAutocompleteQuery>,
                    ) => {
                        let nodesList: DatasetIDsInterface[] = [];
                        if (result.data) {
                            nodesList = result.data.search.query.nodes.map(
                                (node) => ({
                                    name: node.name,
                                    id: node.id,
                                    __typename: node.__typename as TypeNames,
                                }),
                            );
                            // Add dummy result that opens search view
                            nodesList.unshift({
                                __typename: TypeNames.allDataType,
                                id,
                                name: id,
                            });
                        }

                        return nodesList;
                    },
                ),
            );
    }

    //////////////////// Datasets Viewer //////////////////////////////

    public getDatasetOverview(params: {
        id: string;
        numRecords?: number;
    }): Observable<DatasetOverviewQuery> {
        return this.datasetOverviewGQL
            .watch({
                datasetId: params.id,
                limit: params.numRecords || (10 as number),
            })
            .valueChanges.pipe(
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
                map((result: ApolloQueryResult<GetDatasetDataSqlRunQuery>) => {
                    return result.data;
                }),
            );
    }
    public onDatasetHistory(params: {
        id: string;
        numRecords: number;
        numPage: number;
    }): Observable<GetDatasetHistoryQuery> {
        return this.getDatasetHistoryGQL
            .watch({
                datasetId: params.id,
                perPage: params.numRecords || 10,
                page: params.numPage || 0,
            })
            .valueChanges.pipe(
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
                numRecords: params.numRecords || 10,
                numPage: params.page || 0,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetDataSchemaQuery>) => {
                    return result.data;
                }),
            );
    }

    public onSearchMetadata(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<GetDatasetMetadataSchemaQuery> {
        return this.datasetMetadataGQL
            .watch({
                datasetId: params.id,
                numPage: 0,
                numRecords: 1,
            })
            .valueChanges.pipe(
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
        id: string;
    }): Observable<GetDatasetLineageQuery> {
        return this.getDatasetLineageGQL
            .watch({
                datasetId: params.id,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetLineageQuery>) => {
                    return result.data;
                }),
            );
    }
}
