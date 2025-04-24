/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, Router } from "@angular/router";
import { accountSettingsAccessTokensResolverFn } from "./account-settings-access-tokens.resolver";
import { AccessTokenConnection } from "src/app/api/kamu.graphql.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsAccessTokensResolverFn", () => {
    let router: Router;
    let accessTokenService: AccessTokenService;
    let loggedUserService: LoggedUserService;

    const executeResolver: ResolveFn<AccessTokenConnection> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsAccessTokensResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ToastrModule.forRoot(), HttpClientTestingModule],
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
