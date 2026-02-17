/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { ApolloTestingModule } from "apollo-angular/testing";
import { AuthenticatedGuard } from "src/app/auth/guards/authenticated.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";

describe("AuthenticatedGuard", () => {
    let guard: AuthenticatedGuard;
    let loggedUserService: LoggedUserService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        guard = TestBed.inject(AuthenticatedGuard);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });

    interface TestCase {
        authenticated: boolean;
        expectedResult: boolean;
    }

    [
        { authenticated: true, expectedResult: true },
        { authenticated: false, expectedResult: false },
    ].forEach((testCase: TestCase) => {
        it(`should check canActivate method when user is${testCase.authenticated ? "" : "not"} authenticated`, () => {
            const isAuthenticatedSpy = spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(
                testCase.authenticated,
            );
            const result = guard.canActivate();
            expect(result).toEqual(testCase.expectedResult);
            expect(isAuthenticatedSpy).toHaveBeenCalledWith();
        });
    });
});
