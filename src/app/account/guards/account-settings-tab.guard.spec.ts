/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    convertToParamMap,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

import { ApolloTestingModule } from "apollo-angular/testing";

import { mockAccountDetails } from "@api/mock/auth.mock";

import { accountSettingsTabGuard } from "src/app/account/guards/account-settings-tab.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsTabGuard", () => {
    const OTHER_ACCOUNT_NAME = "other-account";

    let loggedUserService: LoggedUserService;
    let router: Router;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsTabGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    function runGuard(accountName: string, isAdmin: boolean): unknown {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue({
            ...mockAccountDetails,
            isAdmin,
        });
        const root = { paramMap: convertToParamMap({}) } as ActivatedRouteSnapshot;
        const accountRoute = {
            paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: accountName }),
        } as ActivatedRouteSnapshot;
        const tabRoute = { paramMap: convertToParamMap({}) } as ActivatedRouteSnapshot;
        const route = { ...tabRoute, pathFromRoot: [root, accountRoute, tabRoute] } as ActivatedRouteSnapshot;
        return executeGuard(route, {} as RouterStateSnapshot);
    }

    it("should allow an admin viewing another account", () => {
        const result = runGuard(OTHER_ACCOUNT_NAME, true);

        expect(result).toBeTrue();
    });

    it("should redirect an admin on their own account to its datasets tab", () => {
        const result = runGuard(mockAccountDetails.accountName, true);

        expect(router.serializeUrl(result as UrlTree)).toEqual(
            `/${mockAccountDetails.accountName}/${ProjectLinks.URL_ACCOUNT_SELECT}/datasets`,
        );
    });

    it("should redirect a non-admin to the account's datasets tab", () => {
        const result = runGuard(OTHER_ACCOUNT_NAME, false);

        expect(router.serializeUrl(result as UrlTree)).toEqual(
            `/${OTHER_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/datasets`,
        );
    });
});
