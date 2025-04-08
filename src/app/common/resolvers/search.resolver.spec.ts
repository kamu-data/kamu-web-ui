/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { searchResolver } from "./search.resolver";
import ProjectLinks from "src/app/project-links";
import { SearchService } from "src/app/search/search.service";
import { Apollo } from "apollo-angular";
import { Observable, of } from "rxjs";
import { DatasetSearchResult } from "src/app/interface/search.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockDatasetSearchResult } from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";
import { AppConfigService } from "src/app/app-config.service";

describe("searchResolver", () => {
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;
    let searchService: SearchService;
    let appConfigService: AppConfigService;
    let searchDatasetsSpy: jasmine.Spy;
    let semanticSearchDatasetsSpy: jasmine.Spy;
    const MOCK_PAGE = 2;
    const MOCK_QUERY = "mock-query";

    const executeResolver: ResolveFn<Observable<DatasetSearchResult>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => searchResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: {},
                    },
                },
            ],
            imports: [ToastrModule.forRoot(), HttpClientTestingModule],
        });
        searchService = TestBed.inject(SearchService);
        router = TestBed.inject(Router);
        appConfigService = TestBed.inject(AppConfigService);
        searchDatasetsSpy = spyOn(searchService, "searchDatasets").and.returnValue(of(mockDatasetSearchResult));
        semanticSearchDatasetsSpy = spyOn(searchService, "semanticSearchDatasets").and.returnValue(
            of(mockDatasetSearchResult),
        );
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check default state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {};
        const result$ = (await executeResolver(
            routeSnapshot,
            router.routerState.snapshot,
        )) as Observable<DatasetSearchResult>;

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
        result$.subscribe((data) => {
            expect(data).toEqual(mockDatasetSearchResult);
        });
    });

    it("should check default state for resolver with empty query", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        const mockDatasetSearchResultCopy = structuredClone(mockDatasetSearchResult);
        mockDatasetSearchResultCopy.datasets = [];
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 1,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "",
        };
        searchDatasetsSpy = searchDatasetsSpy.and.returnValue(of(mockDatasetSearchResultCopy).pipe());
        const result$ = (await executeResolver(
            routeSnapshot,
            router.routerState.snapshot,
        )) as Observable<DatasetSearchResult>;

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
        result$.subscribe((data) => {
            expect(data).toEqual(mockDatasetSearchResultCopy);
        });
    });

    it("should check default state for resolver with non authenticated user", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        const mockDatasetSearchResultCopy = structuredClone(mockDatasetSearchResult);
        mockDatasetSearchResultCopy.datasets = [];
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        };
        searchDatasetsSpy = searchDatasetsSpy.and.returnValue(of(mockDatasetSearchResultCopy));
        const result$ = (await executeResolver(
            routeSnapshot,
            router.routerState.snapshot,
        )) as Observable<DatasetSearchResult>;

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("dd", 1);
        result$.subscribe((data) => {
            expect(data).toEqual(mockDatasetSearchResultCopy);
        });
    });

    it("should check default state for resolver with non available option", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        const mockDatasetSearchResultCopy = structuredClone(mockDatasetSearchResult);
        mockDatasetSearchResultCopy.datasets = [];
        spyOnProperty(appConfigService, "semanticSearchTresholdScore", "get").and.returnValue(undefined);
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        };
        searchDatasetsSpy = searchDatasetsSpy.and.returnValue(of(mockDatasetSearchResultCopy));
        const result$ = (await executeResolver(
            routeSnapshot,
            router.routerState.snapshot,
        )) as Observable<DatasetSearchResult>;

        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("dd", 1);
        result$.subscribe((data) => {
            expect(data).toEqual(mockDatasetSearchResultCopy);
        });
    });

    it("should check state for resolver with semantic search", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        const mockDatasetSearchResultCopy = structuredClone(mockDatasetSearchResult);
        mockDatasetSearchResultCopy.datasets = [];
        spyOnProperty(appConfigService, "semanticSearchTresholdScore", "get").and.returnValue(0.5);
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: 2,
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: "dd",
        };

        searchDatasetsSpy = searchDatasetsSpy.and.returnValue(of(mockDatasetSearchResultCopy).pipe());
        semanticSearchDatasetsSpy = semanticSearchDatasetsSpy.and.returnValue(of(mockDatasetSearchResultCopy));

        const result$ = (await executeResolver(
            routeSnapshot,
            router.routerState.snapshot,
        )) as Observable<DatasetSearchResult>;

        result$.subscribe((data) => {
            expect(semanticSearchDatasetsSpy).toHaveBeenCalledTimes(1);
            expect(data).toEqual(mockDatasetSearchResultCopy);
        });
    });

    it("should check query parameters state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: MOCK_PAGE.toString(),
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: MOCK_QUERY,
        };

        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith(MOCK_QUERY, MOCK_PAGE - 1);
    });
});
