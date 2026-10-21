/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { ApolloTestingModule } from "apollo-angular/testing";

import { authenticatedGuard } from "src/app/auth/guards/authenticated.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("authenticatedGuard", () => {
    let loggedUserService: LoggedUserService;
    let router: Router;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authenticatedGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    it("should allow an authenticated user", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(true);
        const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
        expect(result).toBeTrue();
    });

    it("should redirect an anonymous user home", () => {
        spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(false);
        const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
        expect(router.serializeUrl(result as UrlTree)).toEqual("/");
    });
});
