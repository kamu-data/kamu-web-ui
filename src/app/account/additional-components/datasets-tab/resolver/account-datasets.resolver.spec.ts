/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockDatasetsAccountResponse, TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountService } from "src/app/account/account.service";
import { accountDatasetsResolverFn } from "src/app/account/additional-components/datasets-tab/resolver/account-datasets.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountDatasetsResolverFn", () => {
    let accountService: AccountService;
    let getDatasetsByAccountNameSpy: jasmine.Spy;

    const accountRoute = routeSnapshot({ params: { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME } });
    const tabsRoute = routeSnapshot({ parent: accountRoute });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
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
        getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName").and.returnValue(
            of(mockDatasetsAccountResponse),
        );
    });

    it("should check default state for resolver", async () => {
        const route = routeSnapshot({ parent: tabsRoute });
        const result = await runResolver(accountDatasetsResolverFn, route);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, 0);
        expect(result).toEqual({ datasetsResponse: mockDatasetsAccountResponse, accountName: TEST_ACCOUNT_NAME });
    });

    it("should check state for resolver with page", async () => {
        const pageNumber = 2;
        const route = routeSnapshot({ parent: tabsRoute, queryParams: { page: pageNumber } });
        await runResolver(accountDatasetsResolverFn, route);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(TEST_ACCOUNT_NAME, pageNumber - 1);
    });
});
