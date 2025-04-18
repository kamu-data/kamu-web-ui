/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Apollo } from "apollo-angular";
import { SearchApi } from "../api/search.api";
import { TestBed } from "@angular/core/testing";
import { SearchService } from "./search.service";
import { DatasetAutocompleteItem, DatasetSearchResult, SearchMode } from "../interface/search.interface";
import { mockAutocompleteItems, mockSearchDatasetOverviewQuery } from "./mock.data";
import { of, throwError } from "rxjs";
import { first } from "rxjs/operators";

describe("SearchService", () => {
    let service: SearchService;
    let searchApi: SearchApi;
    const SEARCH_QUERY = "mockQuery";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchApi, Apollo],
        });
        service = TestBed.inject(SearchService);
        searchApi = TestBed.inject(SearchApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should search datasets", () => {
        const searchApiOverviewDataSearchSpy = spyOn(searchApi, "overviewDatasetSearch").and.returnValue(
            of(mockSearchDatasetOverviewQuery),
        );

        const subscription$ = service
            .searchDatasets(SEARCH_QUERY)
            .pipe(first())
            .subscribe((searchResult: DatasetSearchResult) => {
                const expectedSearchData: DatasetSearchResult = {
                    datasets: [mockSearchDatasetOverviewQuery.search.query.nodes[0]],
                    totalCount: 1,
                    pageInfo: mockSearchDatasetOverviewQuery.search.query.pageInfo,
                    currentPage: 1,
                    searchMode: SearchMode.TEXT_SEARCH,
                };
                expect(searchResult).toEqual(expectedSearchData);
            });

        const testSearchValue = "test";
        service.searchDatasets(testSearchValue);

        expect(searchApiOverviewDataSearchSpy).toHaveBeenCalledWith(testSearchValue, 0);
        expect(subscription$.closed).toBeTrue();
    });

    it("should fire autocompleteSearchChanges$ on autocomplete request", () => {
        const searchApiAutocompleteDatasetSearchSpy = spyOn(searchApi, "autocompleteDatasetSearch").and.returnValue(
            of(mockAutocompleteItems),
        );

        const subscription$ = service.searchAutocompleteChanges
            .pipe(first())
            .subscribe((autocompleteItems: DatasetAutocompleteItem[]) => {
                expect(autocompleteItems).toEqual(mockAutocompleteItems);
            });

        const testAutoCompleteValue = "test";
        service.autocompleteDatasetSearch(testAutoCompleteValue);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(testAutoCompleteValue);
        expect(subscription$.closed).toBeTrue();
    });

    it("should fire autocompleteSearchChanges$ with empty collection on autocomplete request failure", () => {
        const searchApiAutocompleteDatasetSearchSpy = spyOn(searchApi, "autocompleteDatasetSearch").and.returnValue(
            throwError(() => "some error"),
        );

        const subscription$ = service.searchAutocompleteChanges
            .pipe(first())
            .subscribe((autocompleteItems: DatasetAutocompleteItem[]) => {
                expect(autocompleteItems).toEqual([]);
            });

        const testAutoCompleteValue = "test";
        service.autocompleteDatasetSearch(testAutoCompleteValue);

        expect(searchApiAutocompleteDatasetSearchSpy).toHaveBeenCalledWith(testAutoCompleteValue);
        expect(subscription$.closed).toBeTrue();
    });
});
