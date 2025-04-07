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
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockDatasetSearchResult } from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";

describe("searchResolver", () => {
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;
    let searchService: SearchService;
    let loggedUserService: LoggedUserService;
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
        loggedUserService = TestBed.inject(LoggedUserService);
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check default state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {};
        const searchDatasetsSpy = spyOn(searchService, "searchDatasets").and.returnValue(
            of(mockDatasetSearchResult).pipe(),
        );
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith("", 0);
    });

    it("should check query parameters state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.queryParams = {
            [ProjectLinks.URL_QUERY_PARAM_PAGE]: MOCK_PAGE.toString(),
            [ProjectLinks.URL_QUERY_PARAM_QUERY]: MOCK_QUERY,
        };
        const searchDatasetsSpy = spyOn(searchService, "searchDatasets").and.returnValue(
            of(mockDatasetSearchResult).pipe(),
        );
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(searchDatasetsSpy).toHaveBeenCalledOnceWith(MOCK_QUERY, MOCK_PAGE - 1);
    });
});
