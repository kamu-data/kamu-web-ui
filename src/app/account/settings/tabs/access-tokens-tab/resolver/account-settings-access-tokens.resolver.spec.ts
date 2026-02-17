/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, Router } from "@angular/router";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { accountSettingsAccessTokensResolverFn } from "src/app/account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

import { AccessTokenConnection } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

describe("accountSettingsAccessTokensResolverFn", () => {
    let router: Router;
    let accessTokenService: AccessTokenService;
    let loggedUserService: LoggedUserService;

    const executeResolver: ResolveFn<AccessTokenConnection> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsAccessTokensResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                Apollo,
                provideAnimations(),
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        router = TestBed.inject(Router);
        accessTokenService = TestBed.inject(AccessTokenService);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver ", async () => {
        const routeSnapshot = {
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const listAccessTokensSpy = spyOn(accessTokenService, "listAccessTokens");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(listAccessTokensSpy).toHaveBeenCalledOnceWith({
            accountId: mockAccountDetails.id,
            page: 0,
            perPage: 15,
        });
    });

    it("should check resolver with query param 'page'", async () => {
        const PAGE = 2;
        const routeSnapshot = {
            queryParamMap: convertToParamMap({ [ProjectLinks.URL_QUERY_PARAM_PAGE]: PAGE }),
        } as ActivatedRouteSnapshot;
        const listAccessTokensSpy = spyOn(accessTokenService, "listAccessTokens");
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(listAccessTokensSpy).toHaveBeenCalledOnceWith({
            accountId: mockAccountDetails.id,
            page: PAGE - 1,
            perPage: 15,
        });
    });
});
