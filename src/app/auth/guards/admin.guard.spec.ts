/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { AdminGuard } from "./admin.guard";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LoggedUserService } from "../logged-user.service";

describe("AdminGuard", () => {
    let guard: AdminGuard;
    let loggedUserService: LoggedUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule, HttpClientTestingModule],
        });
        guard = TestBed.inject(AdminGuard);
        loggedUserService = TestBed.inject(LoggedUserService);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });

    interface TestCase {
        isAdmin: boolean;
        expectedResult: boolean;
    }

    [
        { isAdmin: true, expectedResult: true },
        { isAdmin: false, expectedResult: false },
    ].forEach((testCase: TestCase) => {
        it(`should check canActivate method when user is${testCase.isAdmin ? "" : "not"} admin`, () => {
            const isAuthenticatedSpy = spyOnProperty(loggedUserService, "isAdmin", "get").and.returnValue(
                testCase.isAdmin,
            );
            const result = guard.canActivate();
            expect(result).toEqual(testCase.expectedResult);
            expect(isAuthenticatedSpy).toHaveBeenCalledWith();
        });
    });
});
