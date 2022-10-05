import { ApolloQueryResult } from "@apollo/client/core";
import { Injectable } from "@angular/core";

import { map, first } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
    DatasetAutocompleteItem,
    TypeNames,
} from "../interface/search.interface";

import {
    SearchDatasetsAutocompleteGQL,
    SearchDatasetsOverviewGQL,
    SearchDatasetsOverviewQuery,
    SearchDatasetsAutocompleteQuery,
    DatasetKind,
    DatasetBasicsFragment,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";

@Injectable({ providedIn: "root" })
export class SearchApi {
    constructor(
        private searchDatasetsAutocompleteGQL: SearchDatasetsAutocompleteGQL,
        private searchDatasetsOverviewGQL: SearchDatasetsOverviewGQL,
    ) {}

    // Search query that returns high-level dataset information for displaying the dataset badge
    public overviewDatasetSearch(
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
                first(),
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
    ): Observable<DatasetAutocompleteItem[]> {
        if (id === "") {
            return of([]);
        }
        return this.searchDatasetsAutocompleteGQL
            .watch({ query: id, perPage: 10 })
            .valueChanges.pipe(
                first(),
                map(
                    (
                        result: ApolloQueryResult<SearchDatasetsAutocompleteQuery>,
                    ) => {
                        const nodesList: DatasetAutocompleteItem[] =
                            result.data.search.query.nodes.map((node) => ({
                                dataset: node as DatasetBasicsFragment,
                                __typename: node.__typename as TypeNames,
                            }));
                        // Add dummy result that opens search view
                        nodesList.unshift({
                            __typename: TypeNames.allDataType,
                            dataset: {
                                id,
                                name: id,
                                kind: DatasetKind.Root,
                                owner: {
                                    id: AppValues.defaultUsername,
                                    name: AppValues.defaultUsername,
                                },
                            },
                        });

                        return nodesList;
                    },
                ),
            );
    }
}
