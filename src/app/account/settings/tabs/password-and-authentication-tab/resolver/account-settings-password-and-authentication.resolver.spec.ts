/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { accountSettingsPasswordAndAuthenticationResolverFn } from "src/app/account/settings/tabs/password-and-authentication-tab/resolver/account-settings-password-and-authentication.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountSettingsPasswordAndAuthenticationResolver", () => {
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideHttpClient(), provideHttpClientTesting()],
        });

        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should check to return correct data", async () => {
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const result = await runResolver(accountSettingsPasswordAndAuthenticationResolverFn);
        expect(result).toEqual(mockAccountDetails);
    });
});
