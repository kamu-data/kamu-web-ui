/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { EMPTY, Observable, of } from "rxjs";
import { catchError, first, map } from "rxjs/operators";

import { ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";

import { DatasetAutocompleteItem, TypeNames } from "../interface/search.interface";
import {
    AccountProvider,
    DatasetBasicsFragment,
    DatasetKind,
    SearchDatasetsAutocompleteGQL,
    SearchDatasetsAutocompleteQuery,
    SearchDatasetsOverviewGQL,
    SearchDatasetsOverviewQuery,
    SemanticSearchDatasetsOverviewGQL,
    SemanticSearchDatasetsOverviewQuery,
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
            .watch({
                variables: {
                    query: searchQuery,
                    perPage,
                    page,
                },
                fetchPolicy: "network-only",
                errorPolicy: "all",
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<SearchDatasetsOverviewQuery>) => {
                    return result.data as SearchDatasetsOverviewQuery;
                }),
                catchError(() => EMPTY),
            );
    }

    public overviewDatasetSemanticSearch(
        prompt: string,
        limit = SEARCH_RESULTS_PER_PAGE,
    ): Observable<SemanticSearchDatasetsOverviewQuery> {
        return this.semanticSearchDatasetsOverviewGQL
            .watch({
                variables: {
                    prompt,
                    limit,
                },
                fetchPolicy: "network-only",
                errorPolicy: "all",
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<SemanticSearchDatasetsOverviewQuery>) => {
                    return result.data as SemanticSearchDatasetsOverviewQuery;
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
            .watch({ variables: { query: id, perPage }, context: { skipLoading: true } })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<SearchDatasetsAutocompleteQuery>) => {
                    const nodesList: DatasetAutocompleteItem[] = (result.data?.search?.query?.nodes ?? []).map(
                        (node) => ({
                            dataset: node as DatasetBasicsFragment,
                            dummy: false,
                            __typename: node.__typename as TypeNames,
                        }),
                    );
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
