/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Apollo } from "apollo-angular";

import { accountPasswordProviderGuard } from "@common/guards/account-password-provider.guard";
import { RedirectUrlTestModule } from "@common/modules/redirect-url-test.module";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("accountPasswordProviderGuard", () => {
    let loggedUserService: LoggedUserService;
    let router: Router;

    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accountPasswordProviderGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [RedirectUrlTestModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should allow an account with a password", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(result).toBeTrue();
    });

    it("should redirect an account from another provider home", () => {
        const cloneMockAccountDetails = structuredClone(mockAccountDetails);
        cloneMockAccountDetails.accountProvider = AccountProvider.OauthGithub;

        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(cloneMockAccountDetails);

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(router.serializeUrl(result as UrlTree)).toEqual("/");
    });

    it("should redirect an anonymous user home", () => {
        spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(router.serializeUrl(result as UrlTree)).toEqual("/");
    });
});
