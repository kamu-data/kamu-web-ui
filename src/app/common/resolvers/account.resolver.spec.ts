/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { accountResolver } from "./account.resolver";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { Apollo } from "apollo-angular";
import { AccountService } from "src/app/account/account.service";
import ProjectLinks from "src/app/project-links";
import { TEST_ACCOUNT_NAME } from "src/app/api/mock/dataset.mock";
import { ToastrModule } from "ngx-toastr";

describe("accountResolver", () => {
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;
    let accountService: AccountService;

    const executeResolver: ResolveFn<DatasetsAccountResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: {},
                        paramMap: {},
                    },
                },
            ],
            imports: [ToastrModule.forRoot()],
        });

        accountService = TestBed.inject(AccountService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check default state for resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.params = { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME };
        routeSnapshot.queryParams = {};
        const getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName");
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, 0);
    });

    it("should check state for resolver with page", async () => {
        const pageNumber = 2;
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.params = { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME };
        routeSnapshot.queryParams = { [ProjectLinks.URL_QUERY_PARAM_PAGE]: pageNumber };
        const getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName");
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, pageNumber - 1);
    });
});
