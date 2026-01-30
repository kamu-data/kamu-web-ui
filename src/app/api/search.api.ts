/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloQueryResult } from "@apollo/client/core";
import { inject, Injectable } from "@angular/core";

import { map, first, catchError } from "rxjs/operators";
import { EMPTY, Observable, of } from "rxjs";
import { DatasetAutocompleteItem, TypeNames } from "../interface/search.interface";

import {
    SearchDatasetsAutocompleteGQL,
    SearchDatasetsOverviewGQL,
    SearchDatasetsOverviewQuery,
    SearchDatasetsAutocompleteQuery,
    DatasetKind,
    DatasetBasicsFragment,
    SemanticSearchDatasetsOverviewGQL,
    SemanticSearchDatasetsOverviewQuery,
    AccountProvider,
} from "./kamu.graphql.interface";

export const SEARCH_RESULTS_PER_PAGE = 10;

@Injectable({ providedIn: "root" })
export class SearchApi {
    private searchDatasetsAutocompleteGQL = inject(SearchDatasetsAutocompleteGQL);
    private searchDatasetsOverviewGQL = inject(SearchDatasetsOverviewGQL);
    private semanticSearchDatasetsOverviewGQL = inject(SemanticSearchDatasetsOverviewGQL);

    // Search query that returns high-level dataset information for displaying the dataset badge
    public overviewDatasetSearch(
        searchQuery: string,
        page = 0,
        perPage = SEARCH_RESULTS_PER_PAGE,
    ): Observable<SearchDatasetsOverviewQuery> {
        return this.searchDatasetsOverviewGQL
            .watch(
                {
                    query: searchQuery,
                    perPage,
                    page,
                },
                {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<SearchDatasetsOverviewQuery>) => {
                    return result.data;
                }),
                catchError(() => EMPTY),
            );
    }

    public overviewDatasetSemanticSearch(
        prompt: string,
        limit = SEARCH_RESULTS_PER_PAGE,
    ): Observable<SemanticSearchDatasetsOverviewQuery> {
        return this.semanticSearchDatasetsOverviewGQL
            .watch(
                {
                    prompt,
                    limit,
                },
                {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<SemanticSearchDatasetsOverviewQuery>) => {
                    return result.data;
                }),
                catchError(() => EMPTY),
            );
    }

    public autocompleteDatasetSearch(
        id: string,
        perPage = SEARCH_RESULTS_PER_PAGE,
    ): Observable<DatasetAutocompleteItem[]> {
        if (id === "") {
            return of([]);
        }
        return this.searchDatasetsAutocompleteGQL
            .watch({ query: id, perPage }, { context: { skipLoading: true } })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<SearchDatasetsAutocompleteQuery>) => {
                    const nodesList: DatasetAutocompleteItem[] = result.data.search.query.nodes.map((node) => ({
                        dataset: node as DatasetBasicsFragment,
                        dummy: false,
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
                                id: "",
                                accountName: "",
                                accountProvider: AccountProvider.Password,
                            },
                            alias: "",
                            visibility: {
                                __typename: "PublicDatasetVisibility",
                                anonymousAvailable: true,
                            },
                        },
                        dummy: true,
                    });

                    return nodesList;
                }),
            );
    }
}
