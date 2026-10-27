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
import type { Mock } from "vitest";

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
    let searchDatasetsSpy: Mock;
    let semanticSearchDatasetsSpy: Mock;
    const MOCK_PAGE = 2;
    const MOCK_QUERY = "mock-query";

    function resolve(queryParams: Params): Promise<DatasetSearchResult | RedirectCommand> {
        return runResolver(searchResolverFn, routeSnapshot({ queryParams }));
    }

    function emptySearchResult(): DatasetSearchResult {
        const result = structuredClone(mockDatasetSearchResult);
        result.datasets = [];
        result.totalCount = 0;
        return result;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideToastr(), Apollo, provideHttpClient(), provideHttpClientTesting()],
        });
        searchService = TestBed.inject(SearchService);
        appConfigService = TestBed.inject(AppConfigService);
        searchDatasetsSpy = vi.spyOn(searchService, "searchDatasets").mockReturnValue(of(mockDatasetSearchResult));
        semanticSearchDatasetsSpy = vi
            .spyOn(searchService, "semanticSearchDatasets")
            .mockReturnValue(of(mockDatasetSearchResult));
    });

    it("should search the first page with an empty query when no query parameters are given", async () => {
        const data = await resolve({});

        expect(searchDatasetsSpy).toHaveBeenCalledTimes(1);

        expect(searchDatasetsSpy).toHaveBeenCalledWith("", 0);
        expect(data).toEqual(mockDatasetSearchResult);
    });

    it("should not fall back to semantic search for an empty query", async () => {
        const emptyResult = emptySearchResult();
        searchDatasetsSpy.mockReturnValue(of(emptyResult));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 1,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "",
        });

        expect(searchDatasetsSpy).toHaveBeenCalledTimes(1);

        expect(searchDatasetsSpy).toHaveBeenCalledWith("", 0);
        expect(semanticSearchDatasetsSpy).not.toHaveBeenCalled();
        expect(data).toEqual(emptyResult);
    });

    it("should not fall back to semantic search when the configuration does not enable it", async () => {
        const emptyResult = emptySearchResult();
        vi.spyOn(appConfigService, "semanticSearchThresholdScore", "get").mockReturnValue(undefined);
        searchDatasetsSpy.mockReturnValue(of(emptyResult));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        });

        expect(searchDatasetsSpy).toHaveBeenCalledTimes(1);

        expect(searchDatasetsSpy).toHaveBeenCalledWith("dd", 1);
        expect(semanticSearchDatasetsSpy).not.toHaveBeenCalled();
        expect(data).toEqual(emptyResult);
    });

    it("should fall back to semantic search when the text search finds nothing", async () => {
        vi.spyOn(appConfigService, "semanticSearchThresholdScore", "get").mockReturnValue(0.5);
        searchDatasetsSpy.mockReturnValue(of(emptySearchResult()));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        });

        expect(semanticSearchDatasetsSpy).toHaveBeenCalledTimes(1);

        expect(semanticSearchDatasetsSpy).toHaveBeenCalledWith("dd");
        expect(data).toEqual(mockDatasetSearchResult);
    });

    it("should not fall back to semantic search for a page past the last one", async () => {
        vi.spyOn(appConfigService, "semanticSearchThresholdScore", "get").mockReturnValue(0.5);
        const pastEndResult = { ...structuredClone(mockDatasetSearchResult), datasets: [] };
        searchDatasetsSpy.mockReturnValue(of(pastEndResult));

        const data = await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: "99",
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        });

        expect(semanticSearchDatasetsSpy).not.toHaveBeenCalled();
        expect(data).toEqual(pastEndResult);
    });

    it("should search the first page when the page is not a page number", async () => {
        await resolve({ [ProjectLinks.URL_QUERY_PARAM_PAGE]: "abc", [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd" });

        expect(searchDatasetsSpy).toHaveBeenCalledWith("dd", 0);
    });

    it("should pass the page and query from the query parameters to the search", async () => {
        await resolve({
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: MOCK_PAGE.toString(),
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: MOCK_QUERY,
        });

        expect(searchDatasetsSpy).toHaveBeenCalledTimes(1);

        expect(searchDatasetsSpy).toHaveBeenCalledWith(MOCK_QUERY, MOCK_PAGE - 1);
    });
});
