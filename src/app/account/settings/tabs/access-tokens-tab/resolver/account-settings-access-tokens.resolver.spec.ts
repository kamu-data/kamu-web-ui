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
import { provideToastr } from "ngx-toastr";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { accountSettingsAccessTokensResolverFn } from "src/app/account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsAccessTokensResolverFn", () => {
    let accessTokenService: AccessTokenService;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        });

        accessTokenService = TestBed.inject(AccessTokenService);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should check resolver ", async () => {
        const listAccessTokensSpy = spyOn(accessTokenService, "listAccessTokens");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

        await runResolver(accountSettingsAccessTokensResolverFn);
        expect(listAccessTokensSpy).toHaveBeenCalledOnceWith({
            accountId: mockAccountDetails.id,
            page: 0,
            perPage: 15,
        });
    });

    it("should check resolver with query param 'page'", async () => {
        const PAGE = 2;
        const route = routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_PAGE]: PAGE } });
        const listAccessTokensSpy = spyOn(accessTokenService, "listAccessTokens");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

        await runResolver(accountSettingsAccessTokensResolverFn, route);
        expect(listAccessTokensSpy).toHaveBeenCalledOnceWith({
            accountId: mockAccountDetails.id,
            page: PAGE - 1,
            perPage: 15,
        });
    });
});
