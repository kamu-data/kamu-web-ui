/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";
import { first } from "rxjs/operators";

import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { AuthApi } from "@api/auth.api";
import { AccountFragment, FetchAccountDetailsDocument, LoginDocument } from "@api/kamu.graphql.interface";
import {
    mockAccountDetails,
    mockGithubLoginResponse,
    mockPasswordLoginResponse,
    TEST_ACCESS_TOKEN_GITHUB,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
} from "@api/mock/auth.mock";
import { MaybeNull } from "@interface/app.types";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { LoginService } from "src/app/auth/login/login.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("LoggedUserService", () => {
    let service: LoggedUserService;
    let localStorageService: LocalStorageService;
    let controller: ApolloTestingController;

    describe("Main Test Suite", () => {
        let navigationService: NavigationService;
        let loginService: LoginService;
        let apollo: Apollo;
        let authApi: AuthApi;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [provideToastr()],
                imports: [ApolloTestingModule],
            });

            localStorageService = TestBed.inject(LocalStorageService);
            localStorageService.reset();

            service = TestBed.inject(LoggedUserService);
            apollo = TestBed.inject(Apollo);
            navigationService = TestBed.inject(NavigationService);
            loginService = TestBed.inject(LoginService);
            authApi = TestBed.inject(AuthApi);
            controller = TestBed.inject(ApolloTestingController);
            vi.spyOn(authApi, "fetchAccountFromAccessToken").mockReturnValue(of(mockAccountDetails));
        });

        function checkUserIsLogged(user: AccountFragment): void {
            expect(service.isAuthenticated).toBe(true);
            expect(service.maybeCurrentlyLoggedInUser).toEqual(user);
        }

        function attemptSuccessfulLoginViaAccessToken(): void {
            const localStorageAccessTokenSpy = vi
                .spyOn(localStorageService, "accessToken", "get")
                .mockReturnValue(TEST_ACCESS_TOKEN_GITHUB);

            service.initializeCompletes().subscribe();

            expect(localStorageAccessTokenSpy).toHaveBeenCalledTimes(1);
        }

        function loginFullyViaGithub(): void {
            loginService.githubLogin({ code: TEST_GITHUB_CODE }, null);

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockGithubLoginResponse,
            });
        }

        function loginFullyViaPassword(): void {
            loginService.passwordLogin(
                {
                    login: TEST_LOGIN,
                    password: TEST_PASSWORD,
                },
                null,
            );

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockPasswordLoginResponse,
            });
        }

        it("should be created", () => {
            expect(service).toBeTruthy();
        });

        it("should check user is initially non-authenticated", () => {
            expect(service.isAuthenticated).toBe(false);
            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
        });

        it("should check user is non-authenticated if no access token exists", () => {
            const localStorageAccessTokenSpy = vi
                .spyOn(localStorageService, "accessToken", "get")
                .mockReturnValue(null);
            service.initializeCompletes().subscribe();

            controller.expectNone(FetchAccountDetailsDocument);
            expect(service.isAuthenticated).toBe(false);
            expect(localStorageAccessTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("should check user changes via login with alive access token", fakeAsync(() => {
            attemptSuccessfulLoginViaAccessToken();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    if (user) {
                        checkUserIsLogged(user);
                    } else {
                        throw new Error("User must not be null");
                    }
                });
            expect(userChanges$.closed).toBe(true);
            flush();
        }));

        it("should check user changes via full login Github", fakeAsync(() => {
            const accessTokenSetSpy = vi.spyOn(localStorageService, "setAccessToken").mockImplementation(() => {});

            loginFullyViaGithub();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    if (user) {
                        checkUserIsLogged(user);
                    } else {
                        throw new Error("User must not be null");
                    }
                });

            expect(accessTokenSetSpy).toHaveBeenCalledWith(mockGithubLoginResponse.auth.login.accessToken);

            expect(userChanges$.closed).toBe(true);
            flush();
        }));

        it("should check user changes via full login password", fakeAsync(() => {
            const accessTokenSetSpy = vi.spyOn(localStorageService, "setAccessToken").mockImplementation(() => {});

            loginFullyViaPassword();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    if (user) {
                        checkUserIsLogged(user);
                    } else {
                        throw new Error("User must not be null");
                    }
                });

            expect(accessTokenSetSpy).toHaveBeenCalledWith(mockPasswordLoginResponse.auth.login.accessToken);

            expect(userChanges$.closed).toBe(true);
            flush();
        }));

        it("should check user logout navigates to home page and clears GraphQL cache", fakeAsync(() => {
            const navigationServiceSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});
            const apolloClientSpy = stubMethod(apollo.client.cache, "restore");

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.logout();

            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).toHaveBeenCalledWith();
            expect(apolloClientSpy).toHaveBeenCalledTimes(1);
            flush();
        }));

        it("should check user terminate session does not navigate to home page", fakeAsync(() => {
            const navigationServiceSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.terminateSession();

            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).not.toHaveBeenCalled();
            flush();
        }));
    });
});
