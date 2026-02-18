/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { accountSettingsActiveTabResolverFn } from "src/app/account/settings/resolver/account-settings-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<AccountSettingsTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check to resolve an active tab", async () => {
        const routeSnapshot = {
            children: [
                {
                    data: {
                        [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCESS_TOKENS,
                    },
                },
            ],
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = await accountSettingsActiveTabResolverFn(routeSnapshot, mockState);
        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });
});
