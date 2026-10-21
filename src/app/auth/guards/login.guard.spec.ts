/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { ApolloTestingModule } from "apollo-angular/testing";

import { RedirectUrlTestModule } from "@common/modules/redirect-url-test.module";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { loginGuard } from "src/app/auth/guards/login.guard";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import ProjectLinks from "src/app/project-links";

describe("loginGuard", () => {
    let loginMethodsService: LoginMethodsService;
    let loggedUserService: LoggedUserService;
    let appConfigService: AppConfigService;
    let router: Router;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => loginGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule, RedirectUrlTestModule],
        });
        loginMethodsService = TestBed.inject(LoginMethodsService);
        loggedUserService = TestBed.inject(LoggedUserService);
        appConfigService = TestBed.inject(AppConfigService);
        router = TestBed.inject(Router);
    });

    interface TestCase {
        description: string;
        url: string;
        loginMethods: AccountProvider[];
        loadFailed?: boolean;
        isAuthenticated: boolean;
        allowAnonymous: boolean;
        expectedRedirect: MaybeUndefined<string>;
    }

    [
        {
            description: "allow an anonymous user when login methods exist",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [AccountProvider.Password],
            isAuthenticated: false,
            allowAnonymous: true,
            expectedRedirect: undefined,
        },
        {
            description: "allow the login URL with a redirect parameter",
            url: `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=%2Fkamu`,
            loginMethods: [AccountProvider.Password],
            isAuthenticated: false,
            allowAnonymous: true,
            expectedRedirect: undefined,
        },
        {
            description: "redirect home when there are no login methods",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [],
            isAuthenticated: false,
            allowAnonymous: true,
            expectedRedirect: "/",
        },
        {
            description: "redirect home with a redirect parameter when there are no login methods",
            url: `/${ProjectLinks.URL_LOGIN}?${ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL}=%2Fkamu`,
            loginMethods: [],
            isAuthenticated: false,
            allowAnonymous: true,
            expectedRedirect: "/",
        },
        {
            description: "redirect home an authenticated user",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [AccountProvider.Password],
            isAuthenticated: true,
            allowAnonymous: true,
            expectedRedirect: "/",
        },
        {
            description:
                "redirect to the login-unavailable page when there are no login methods and anonymous access is forbidden",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [],
            isAuthenticated: false,
            allowAnonymous: false,
            expectedRedirect: `/${ProjectLinks.URL_LOGIN_UNAVAILABLE}`,
        },
        {
            description:
                "redirect to the login-unavailable page when the login methods could not be loaded and anonymous access is forbidden",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [],
            loadFailed: true,
            isAuthenticated: false,
            allowAnonymous: false,
            expectedRedirect: `/${ProjectLinks.URL_LOGIN_UNAVAILABLE}`,
        },
        {
            description: "redirect home when the login methods could not be loaded and anonymous access is allowed",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [],
            loadFailed: true,
            isAuthenticated: false,
            allowAnonymous: true,
            expectedRedirect: "/",
        },
        {
            description: "redirect home an authenticated user when anonymous access is forbidden",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [],
            isAuthenticated: true,
            allowAnonymous: false,
            expectedRedirect: "/",
        },
        {
            description: "allow an anonymous user when login methods exist and anonymous access is forbidden",
            url: `/${ProjectLinks.URL_LOGIN}`,
            loginMethods: [AccountProvider.Password],
            isAuthenticated: false,
            allowAnonymous: false,
            expectedRedirect: undefined,
        },
    ].forEach((testCase: TestCase) => {
        it(`should ${testCase.description}`, () => {
            spyOnProperty(loginMethodsService, "loginMethods", "get").and.returnValue(testCase.loginMethods);
            spyOnProperty(loginMethodsService, "loadFailed", "get").and.returnValue(testCase.loadFailed ?? false);
            spyOnProperty(loggedUserService, "isAuthenticated", "get").and.returnValue(testCase.isAuthenticated);
            spyOnProperty(appConfigService, "allowAnonymous", "get").and.returnValue(testCase.allowAnonymous);

            const result = executeGuard({} as ActivatedRouteSnapshot, { url: testCase.url } as RouterStateSnapshot);

            if (testCase.expectedRedirect === undefined) {
                expect(result).toBeTrue();
            } else {
                expect(router.serializeUrl(result as UrlTree)).toEqual(testCase.expectedRedirect);
            }
        });
    });
});
