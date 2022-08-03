import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map } from "rxjs/operators";
import { ApolloQueryResult } from "@apollo/client/core";
import { Observable, of } from "rxjs";
import {
    DatasetIDsInterface,
    TypeNames,
} from "../interface/search.interface";

import { ApolloQuerySearchResultNodeInterface } from "./apolloQueryResult.interface";
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
    SearchDatasetsOverviewQuery, Datasets, PageBasedInfo, Search,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";

@Injectable()
export class SearchApi {
    /* eslint-disable  @typescript-eslint/no-explicit-any */

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

    // Search query that returs high-level dataset information for displaying the dataaset badge
    public searchOverview(
        searchQuery: string,
        page = 0,
        perPage = 10,
    ): Observable<{search: Search}> {
        // @ts-ignore
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
                map((result: ApolloQueryResult<any>) => {
                    const nodesList: DatasetIDsInterface[] =
                        result.data.search.query.nodes.map(
                            (node: ApolloQuerySearchResultNodeInterface) => ({
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
                    return nodesList;
                }),
            );
    }

    //////////////////// Datasets Viewer //////////////////////////////

    public getDatasetOverview(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<DatasetOverviewQuery | undefined> {
        return this.datasetOverviewGQL
            .watch({
                datasetId: params.id,
                limit: params.numRecords || (10 as number),
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<DatasetOverviewQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }
    public onGetDatasetDataSQLRun(params: {
        query: string;
        limit: number;
    }): Observable<GetDatasetDataSqlRunQuery | undefined> {
        debugger
        return this.getDatasetDataSQLRun
            .watch({ query: params.query, limit: params.limit })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetDataSqlRunQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }
    public onDatasetHistory(params: {
        id: string;
        numRecords: number;
        numPage: number;
    }): Observable<{ datasets: Datasets }> {
        // @ts-ignore
        return this.getDatasetHistoryGQL
            .watch({
                datasetId: params.id,
                perPage: params.numRecords || 10,
                page: params.numPage || 0,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetHistoryQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }
    public getDatasetDataSchema(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<GetDatasetDataSchemaQuery | undefined> {
        return this.getDatasetDataSchemaGQL
            .watch({
                datasetId: params.id,
                numRecords: params.numRecords || 10,
                numPage: params.page || 0,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetDataSchemaQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }

    // tslint:disable-next-line: no-any
    public onSearchMetadata(params: {
        id: string;
        numRecords?: number;
        page?: number;
    }): Observable<{ datasets: Datasets } | undefined> {
        return this.datasetMetadataGQL
            .watch({
                datasetId: params.id,
                numPage: 0,
                numRecords: 1,
            })
            .valueChanges.pipe(
                map(
                    (
                        result: ApolloQueryResult<any>,
                    ) => {
                        if (result.data) {
                            return result.data;
                        }
                        return undefined;
                    },
                ),
            );
    }

    public getDatasetLineage(params: {
        id: string;
    }): Observable<GetDatasetLineageQuery | undefined> {
        return this.getDatasetLineageGQL
            .watch({
                datasetId: params.id,
            })
            .valueChanges.pipe(
                map((result: ApolloQueryResult<GetDatasetLineageQuery>) => {
                    if (result.data) {
                        return result.data;
                    }
                    return undefined;
                }),
            );
    }

    // tslint:disable-next-line: no-any
    public clearlyData(edge: any) {
        const object = edge;
        const value = "typename";
        const nodeKeys: string[] = Object.keys(object).filter(
            (key) => !key.includes(value),
        );
        const d = Object();

        nodeKeys.forEach((nodeKey: string) => {
            d[nodeKey] = (edge as any)[nodeKey];
        });

        return d;
    }
    getTypeNameBlock(node: any): string[] {
        const object = node;
        const value = "typename";
        return Object.keys(object).filter((key) => key.includes(value));
    }
}
