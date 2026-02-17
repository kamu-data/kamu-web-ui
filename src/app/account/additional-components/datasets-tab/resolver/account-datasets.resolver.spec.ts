/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ResolveFn, Router } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { TEST_ACCOUNT_NAME } from "src/app/api/mock/dataset.mock";
import { DatasetsAccountResolverResponse } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";

import { accountDatasetsResolverFn } from "./account-datasets.resolver";

describe("accountDatasetsResolverFn", () => {
    let router: Router;
    let accountService: AccountService;
    let getDatasetsByAccountNameSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetsAccountResolverResponse> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountDatasetsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                provideAnimations(),
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: {},
                        paramMap: {},
                    },
                },
            ],
        });

        accountService = TestBed.inject(AccountService);
        router = TestBed.inject(Router);
        getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName").and.returnValue(of().pipe());
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check default state for resolver", async () => {
        const routeSnapshot = {
            parent: {
                parent: {
                    paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME }),
                },
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, 0);
    });

    it("should check state for resolver with page", async () => {
        const pageNumber = 2;
        const routeSnapshot = {
            parent: {
                parent: {
                    paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME }),
                },
            },
            queryParamMap: convertToParamMap({ page: pageNumber }),
        } as ActivatedRouteSnapshot;
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, pageNumber - 1);
    });
});
