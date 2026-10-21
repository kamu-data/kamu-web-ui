/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Apollo } from "apollo-angular";

import { forbidAnonymousAccessGuardFn } from "@common/guards/forbid-anonymous-access.guard";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

describe("forbidAnonymousAccessGuardFn", () => {
    let loggedUserService: LoggedUserService;
    let router: Router;

    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => forbidAnonymousAccessGuardFn(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should return true when user is logged in", () => {
        const maybeCurrentlyLoggedInUserSpy: jasmine.Spy = spyOnProperty(
            loggedUserService,
            "maybeCurrentlyLoggedInUser",
            "get",
        ).and.returnValue(mockAccountDetails);

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(result).toBe(true);
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
    });

    it("should redirect to login when user is not logged in", () => {
        const maybeCurrentlyLoggedInUserSpy: jasmine.Spy = spyOnProperty(
            loggedUserService,
            "maybeCurrentlyLoggedInUser",
            "get",
        ).and.returnValue(null);

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(router.serializeUrl(result as UrlTree)).toEqual(`/${ProjectLinks.URL_LOGIN}`);
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
    });
});
