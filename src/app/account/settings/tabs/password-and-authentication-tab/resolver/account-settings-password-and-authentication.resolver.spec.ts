/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "./account-settings-password-and-authentication.resolver";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { Apollo } from "apollo-angular";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("accountSettingsPasswordAndAuthenticationResolver", () => {
    let loggedUserService: LoggedUserService;

    const executeResolver: ResolveFn<AccountFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsPasswordAndAuthenticationResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
    imports: [],
    providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
