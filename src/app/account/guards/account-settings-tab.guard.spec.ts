/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { GuardResult } from "@angular/router";

import { ApolloTestingModule } from "apollo-angular/testing";

import { expectRedirectTo, routeSnapshot, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { accountSettingsTabGuard } from "src/app/account/guards/account-settings-tab.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsTabGuard", () => {
    const OTHER_ACCOUNT_NAME = "other-account";

    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    function runGuard(accountName: string, isAdmin: boolean): Promise<GuardResult> {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue({
            ...mockAccountDetails,
            isAdmin,
        });
        const root = routeSnapshot();
        const accountRoute = routeSnapshot({
            params: { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: accountName },
            parent: root,
        });
        const tabRoute = routeSnapshot({ parent: accountRoute });
        return runCanActivate(accountSettingsTabGuard, tabRoute);
    }

    it("should allow an admin viewing another account", async () => {
        const result = await runGuard(OTHER_ACCOUNT_NAME, true);

        expect(result).toBeTrue();
    });

    it("should redirect an admin on their own account to its datasets tab", async () => {
        const result = await runGuard(mockAccountDetails.accountName, true);

        expectRedirectTo(result, `/${mockAccountDetails.accountName}/${ProjectLinks.URL_ACCOUNT_SELECT}/datasets`);
    });

    it("should redirect a non-admin to the account's datasets tab", async () => {
        const result = await runGuard(OTHER_ACCOUNT_NAME, false);

        expectRedirectTo(result, `/${OTHER_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/datasets`);
    });
});
