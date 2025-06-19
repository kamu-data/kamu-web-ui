/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { accountPasswordProviderGuard } from "./account-password-provider.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AccountProvider } from "src/app/api/kamu.graphql.interface";

describe("accountPasswordProviderGuard", () => {
    let loggedUserService: LoggedUserService;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accountPasswordProviderGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [HttpClientTestingModule],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should check to return true", async () => {
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const state = {} as RouterStateSnapshot;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        const result = await executeGuard(routeSnapshot, state);
        expect(result).toEqual(true);
    });

    it("should check to return false", async () => {
        const routeSnapshot = {} as ActivatedRouteSnapshot;
        const state = {} as RouterStateSnapshot;
        const cloneMockAccountDetails = structuredClone(mockAccountDetails);
        cloneMockAccountDetails.accountProvider = AccountProvider.OauthGithub;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(cloneMockAccountDetails);
        const result = await executeGuard(routeSnapshot, state);
        expect(result).toEqual(false);
    });
});
