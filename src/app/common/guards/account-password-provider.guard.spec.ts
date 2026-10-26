/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { accountPasswordProviderGuard } from "@common/guards/account-password-provider.guard";
import { expectRedirectTo, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { RedirectUrlTestModule } from "@common/modules/redirect-url-test.module";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountPasswordProviderGuard", () => {
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [RedirectUrlTestModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should allow an account with a password", async () => {
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        expect(await runCanActivate(accountPasswordProviderGuard)).toBe(true);
    });

    it("should redirect an account from another provider home", async () => {
        const cloneMockAccountDetails = structuredClone(mockAccountDetails);
        cloneMockAccountDetails.accountProvider = AccountProvider.OauthGithub;

        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(cloneMockAccountDetails);

        expectRedirectTo(await runCanActivate(accountPasswordProviderGuard), "/");
    });

    it("should redirect an anonymous user home", async () => {
        vi.spyOn(loggedUserService, "maybeCurrentlyLoggedInUser", "get").mockReturnValue(null);

        expectRedirectTo(await runCanActivate(accountPasswordProviderGuard), "/");
    });
});
