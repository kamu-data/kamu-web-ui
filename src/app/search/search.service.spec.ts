/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";
import { first } from "rxjs/operators";

import { Apollo } from "apollo-angular";

import { SearchApi } from "@api/search.api";
import { DatasetSearchResult, SearchMode } from "@interface/search.interface";

import { mockSearchDatasetOverviewQuery } from "src/app/search/mock.data";
import { SearchService } from "src/app/search/search.service";

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
        const searchApiOverviewDataSearchSpy = vi
            .spyOn(searchApi, "overviewDatasetSearch")
            .mockReturnValue(of(mockSearchDatasetOverviewQuery));

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
        expect(subscription$.closed).toBe(true);
    });
});
