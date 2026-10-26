/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { forbidAnonymousAccessGuardFn } from "@common/guards/forbid-anonymous-access.guard";
import { expectRedirectTo, routeSnapshot, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import ProjectLinks from "src/app/project-links";

describe("forbidAnonymousAccessGuardFn", () => {
    let loggedUserService: LoggedUserService;
    let loginMethodsService: LoginMethodsService;

    const DEEP_LINK = "/kamu/dataset?tab=flows&page=2";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        loggedUserService = TestBed.inject(LoggedUserService);
        loginMethodsService = TestBed.inject(LoginMethodsService);
    });

    it("should return true when user is logged in", async () => {
        const maybeCurrentlyLoggedInUserSpy: jasmine.Spy = spyOnProperty(
            loggedUserService,
            "maybeCurrentlyLoggedInUser",
            "get",
        ).and.returnValue(mockAccountDetails);

        const result = await runCanActivate(forbidAnonymousAccessGuardFn, routeSnapshot(), DEEP_LINK);

        expect(result).toBe(true);
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
    });

    it("should redirect to login with the requested URL when user is not logged in", async () => {
        spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([AccountProvider.Password]);
        const maybeCurrentlyLoggedInUserSpy: jasmine.Spy = spyOnProperty(
            loggedUserService,
            "maybeCurrentlyLoggedInUser",
            "get",
        ).and.returnValue(null);

        const result = await runCanActivate(forbidAnonymousAccessGuardFn, routeSnapshot(), DEEP_LINK);

        expectRedirectTo(
            result,
            `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=${encodeURIComponent(DEEP_LINK)}`,
        );
        expect(maybeCurrentlyLoggedInUserSpy).toHaveBeenCalledTimes(1);
    });

    [
        { description: "there are no login methods", loadFailed: false },
        { description: "the login methods could not be loaded", loadFailed: true },
    ].forEach(({ description, loadFailed }) => {
        it(`should redirect to the login-unavailable page when ${description}`, async () => {
            spyOnProperty(loggedUserService, "maybeCurrentlyLoggedInUser", "get").and.returnValue(null);
            spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue([]);
            spyOnProperty(loginMethodsService, "loadFailed", "get").and.returnValue(loadFailed);

            const result = await runCanActivate(forbidAnonymousAccessGuardFn, routeSnapshot(), DEEP_LINK);

            expectRedirectTo(result, `/${ProjectLinks.URL_LOGIN_UNAVAILABLE}`);
        });
    });
});
