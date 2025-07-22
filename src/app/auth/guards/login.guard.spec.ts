/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { LoginGuard } from "./login.guard";
import ProjectLinks from "src/app/project-links";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AccountProvider } from "src/app/api/kamu.graphql.interface";
import { LoginMethodsService } from "../login-methods.service";

describe("LoginGuard", () => {
    let guard: LoginGuard;
    let loginMethodsService: LoginMethodsService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
        });
        guard = TestBed.inject(LoginGuard);
        loginMethodsService = TestBed.inject(LoginMethodsService);
    });

    it("should be created", () => {
        expect(guard).toBeTruthy();
    });

    interface TestCase {
        route: string;
        loginMethods: AccountProvider[];
        expectedResult: boolean;
    }

    [
        {
            route: ProjectLinks.URL_LOGIN,
            loginMethods: [AccountProvider.Password],
            expectedResult: true,
        },
        {
            route: ProjectLinks.URL_LOGIN,
            loginMethods: [],
            expectedResult: false,
        },
        {
            route: ProjectLinks.URL_SEARCH,
            loginMethods: [AccountProvider.Password],
            expectedResult: true,
        },
        {
            route: ProjectLinks.URL_SEARCH,
            loginMethods: [],
            expectedResult: true,
        },
    ].forEach((testCase: TestCase) => {
        it(`should check route ${testCase.route} with login ${
            testCase.loginMethods.length > 0 ? "enabled" : "disabled"
        }`, () => {
            spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue(testCase.loginMethods);

            const result = guard.canActivate(new ActivatedRouteSnapshot(), {
                url: "/" + testCase.route,
            } as RouterStateSnapshot);

            expect(result).toEqual(testCase.expectedResult);
        });
    });
});
