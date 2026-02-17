/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";

import { Apollo } from "apollo-angular";

import { accessTokenExpiredGuardFn } from "@common/guards/access-token-expired.guard";

import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("accessTokenExpiredGuard", () => {
    let localStorageService: LocalStorageService;
    let navigationService: NavigationService;

    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accessTokenExpiredGuardFn(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        localStorageService = TestBed.inject(LocalStorageService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should check guard return true", () => {
        localStorageService.setAccessToken(null);
        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(result).toBe(true);
    });

    it("should check guard return false", () => {
        const expiredToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRtaXRyaXkiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.BvM9I0B-_j0XkXnWw9g8kC09fgzFg7UD2CQlj4L5LPk";
        localStorageService.setAccessToken(expiredToken);
        const navigateSpy: jasmine.Spy = spyOn(navigationService, "navigateToLogin").and.stub();

        const result = executeGuard(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(result).toBe(false);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
});
