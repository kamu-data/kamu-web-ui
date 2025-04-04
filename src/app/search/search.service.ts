/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { Observable, Subject, map } from "rxjs";
import { SearchApi } from "../api/search.api";
import { DatasetAutocompleteItem, DatasetSearchResult } from "../interface/search.interface";
import {
    DatasetSearchOverviewFragment,
    SearchDatasetsOverviewQuery,
    SemanticSearchDatasetsOverviewQuery,
} from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class SearchService {
    private searchAutocomplete$: Subject<DatasetAutocompleteItem[]> = new Subject<DatasetAutocompleteItem[]>();
    private searchApi = inject(SearchApi);

    private emitSearchAutocompleteChanged(autocompleteData: DatasetAutocompleteItem[]) {
        this.searchAutocomplete$.next(autocompleteData);
    }

    public get searchAutocompleteChanges(): Observable<DatasetAutocompleteItem[]> {
        return this.searchAutocomplete$.asObservable();
    }

    public searchDatasets(searchQuery: string, page = 0): Observable<DatasetSearchResult> {
        return this.searchApi.overviewDatasetSearch(searchQuery, page).pipe(
            map((data: SearchDatasetsOverviewQuery) => {
                const datasets: DatasetSearchOverviewFragment[] = data.search.query.nodes;
                const pageInfo = data.search.query.pageInfo;
                const totalCount: number = data.search.query.totalCount;
                return {
                    datasets,
                    pageInfo,
                    totalCount,
                    currentPage: page + 1,
                };
            }),
        );
    }

    public autocompleteDatasetSearch(searchQuery: string): void {
        this.searchApi.autocompleteDatasetSearch(searchQuery).subscribe(
            (data: DatasetAutocompleteItem[]) => {
                this.emitSearchAutocompleteChanged(data);
            },
            () => {
                this.emitSearchAutocompleteChanged([]);
            },
        );
    }

    public semanticSearchDatasets(promt: string): Observable<DatasetSearchResult> {
        return this.searchApi.overviewDatasetSemanticSearch(promt).pipe(
            map((data: SemanticSearchDatasetsOverviewQuery) => {
                const datasets: DatasetSearchOverviewFragment[] = data.search.queryNaturalLanguage.nodes.map(
                    (node) => node.item as DatasetSearchOverviewFragment,
                );
                const pageInfo = data.search.queryNaturalLanguage.pageInfo;
                const totalCount = data.search.queryNaturalLanguage.totalCount;
                const page = data.search.queryNaturalLanguage.pageInfo.currentPage;
                return {
                    datasets,
                    pageInfo,
                    totalCount,
                    currentPage: page + 1,
                };
            }),
        );
    }
}
