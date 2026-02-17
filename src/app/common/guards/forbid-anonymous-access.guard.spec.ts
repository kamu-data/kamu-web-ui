/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";

import { mockAccountDetails } from "@api/mock/auth.mock";
import { Apollo } from "apollo-angular";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { NavigationService } from "src/app/services/navigation.service";

import { forbidAnonymousAccessGuardFn } from "./forbid-anonymous-access.guard";

describe("forbidAnonymousAccessGuardFn", () => {
    let loggedUserService: LoggedUserService;
    let navigationService: NavigationService;

    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => forbidAnonymousAccessGuardFn(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        navigationService = TestBed.inject(NavigationService);
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
        const navigateSpy: jasmine.Spy = spyOn(navigationService, "navigateToLogin").and.stub();

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(result).toBe(true);
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should return false when user is not logged in", () => {
        const maybeCurrentlyLoggedInUserSpy: jasmine.Spy = spyOnProperty(
            loggedUserService,
            "maybeCurrentlyLoggedInUser",
            "get",
        ).and.returnValue(null);
        const navigateSpy: jasmine.Spy = spyOn(navigationService, "navigateToLogin").and.stub();

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);

        expect(result).toBe(false);
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
});
