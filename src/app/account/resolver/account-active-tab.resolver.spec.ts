/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { AccountTabs } from "src/app/account/account.constants";
import { accountActiveTabResolverFn } from "src/app/account/resolver/account-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<AccountTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            children: [
                {
                    children: [
                        {
                            data: {
                                [ProjectLinks.URL_PARAM_TAB]: AccountTabs.DATASETS,
                            },
                        },
                    ],
                },
            ],
        } as ActivatedRouteSnapshot;
        const result = await executeResolver(mockRoute, mockState);

        expect(result).toEqual(AccountTabs.DATASETS);
    });
});
