/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Apollo } from "apollo-angular";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "src/app/account/settings/tabs/password-and-authentication-tab/resolver/account-settings-password-and-authentication.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";

import { AccountFragment } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

describe("accountSettingsPasswordAndAuthenticationResolver", () => {
    let loggedUserService: LoggedUserService;

    const executeResolver: ResolveFn<AccountFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsPasswordAndAuthenticationResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check to return correct data", async () => {
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const state = {} as RouterStateSnapshot;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const result = await executeResolver(routeSnapshot, state);
        expect(result).toEqual(mockAccountDetails);
    });
});
