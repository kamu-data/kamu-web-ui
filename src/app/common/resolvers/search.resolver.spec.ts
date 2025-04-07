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
import { Observable } from "rxjs";
import { DatasetSearchResult } from "src/app/interface/search.interface";

describe("searchResolver", () => {
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;
    let searchService: SearchService;
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
        });
        searchService = TestBed.inject(SearchService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check default state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {};
        const searchDatasetsSpy = spyOn(searchService, "searchDatasets");
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
    });

    it("should check query parameters state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: MOCK_PAGE.toString(),
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: MOCK_QUERY,
        };

        const searchDatasetsSpy = spyOn(searchService, "searchDatasets");
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith(MOCK_QUERY, MOCK_PAGE - 1);
    });
});
