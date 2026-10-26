/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Params, RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { DatasetSearchResult } from "@interface/search.interface";

import { AppConfigService } from "src/app/app-config.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetSearchResult } from "src/app/search/mock.data";
import { searchResolverFn } from "src/app/search/resolver/search.resolver";
import { SearchService } from "src/app/search/search.service";

describe("searchResolverFn", () => {
    let searchService: SearchService;
    let appConfigService: AppConfigService;
    let searchDatasetsSpy: jasmine.Spy;
    let semanticSearchDatasetsSpy: jasmine.Spy;
    const MOCK_PAGE = 2;
    const MOCK_QUERY = "mock-query";

    function resolve(queryParams: Params): Promise<DatasetSearchResult | RedirectCommand> {
        return runResolver(searchResolverFn, routeSnapshot({ queryParams }));
    }

    function emptySearchResult(): DatasetSearchResult {
        const result = structuredClone(mockDatasetSearchResult);
        result.datasets = [];
        return result;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideToastr(), Apollo, provideHttpClient(), provideHttpClientTesting()],
        });
        searchService = TestBed.inject(SearchService);
        appConfigService = TestBed.inject(AppConfigService);
        searchDatasetsSpy = spyOn(searchService, "searchDatasets").and.returnValue(of(mockDatasetSearchResult));
        semanticSearchDatasetsSpy = spyOn(searchService, "semanticSearchDatasets").and.returnValue(
            of(mockDatasetSearchResult),
        );
    });

    it("should search the first page with an empty query when no query parameters are given", async () => {
        const data = await resolve({});

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
        expect(data).toEqual(mockDatasetSearchResult);
    });

    it("should not fall back to semantic search for an empty query", async () => {
        const emptyResult = emptySearchResult();
        searchDatasetsSpy.and.returnValue(of(emptyResult));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 1,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "",
        });

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
        expect(semanticSearchDatasetsSpy).not.toHaveBeenCalled();
        expect(data).toEqual(emptyResult);
    });

    it("should not fall back to semantic search when the configuration does not enable it", async () => {
        const emptyResult = emptySearchResult();
        spyOnProperty(appConfigService, "semanticSearchThresholdScore", "get").and.returnValue(undefined);
        searchDatasetsSpy.and.returnValue(of(emptyResult));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        });

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("dd", 1);
        expect(semanticSearchDatasetsSpy).not.toHaveBeenCalled();
        expect(data).toEqual(emptyResult);
    });

    it("should fall back to semantic search when the text search finds nothing", async () => {
        spyOnProperty(appConfigService, "semanticSearchThresholdScore", "get").and.returnValue(0.5);
        searchDatasetsSpy.and.returnValue(of(emptySearchResult()));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        });

        expect(semanticSearchDatasetsSpy).toHaveBeenCalledOnceWith("dd");
        expect(data).toEqual(mockDatasetSearchResult);
    });

    it("should pass the page and query from the query parameters to the search", async () => {
        await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: MOCK_PAGE.toString(),
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: MOCK_QUERY,
        });

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith(MOCK_QUERY, MOCK_PAGE - 1);
    });
});
