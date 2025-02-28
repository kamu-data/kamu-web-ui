/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Apollo } from "apollo-angular";
import { AuthApi } from "../api/auth.api";
import { LoggedUserService } from "./logged-user.service";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { NavigationService } from "../services/navigation.service";
import {
    TEST_ACCESS_TOKEN_GITHUB,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
    mockGithubLoginResponse,
    mockLoginInstructions,
    mockPasswordLoginResponse,
    mockAccountFromAccessToken,
} from "../api/mock/auth.mock";
import { AccountFragment, FetchAccountDetailsDocument, LoginDocument } from "../api/kamu.graphql.interface";
import { first } from "rxjs/operators";
import { MaybeNull } from "../interface/app.types";
import { AppConfigService } from "../app-config.service";
import { GithubLoginCredentials, PasswordLoginCredentials } from "../api/auth.api.model";
import { LoginService } from "./login/login.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LocalStorageService } from "../services/local-storage.service";

describe("LoggedUserService", () => {
    let service: LoggedUserService;
    let localStorageService: LocalStorageService;
    let controller: ApolloTestingController;

    describe("Main Test Suite", () => {
        let navigationService: NavigationService;
        let loginService: LoginService;
        let apollo: Apollo;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [AuthApi, Apollo],
                imports: [ApolloTestingModule, HttpClientTestingModule],
            });

            localStorageService = TestBed.inject(LocalStorageService);
            localStorageService.reset();

            service = TestBed.inject(LoggedUserService);
            apollo = TestBed.inject(Apollo);
            navigationService = TestBed.inject(NavigationService);
            loginService = TestBed.inject(LoginService);
            controller = TestBed.inject(ApolloTestingController);
        });

        function checkUserIsLogged(user: AccountFragment): void {
            expect(service.isAuthenticated).toBeTrue();
            expect(service.maybeCurrentlyLoggedInUser).toEqual(user);
        }

        function attemptSuccessfulLoginViaAccessToken(): void {
            const localStorageAccessTokenSpy = spyOnProperty(localStorageService, "accessToken", "get").and.returnValue(
                TEST_ACCESS_TOKEN_GITHUB,
            );

            service.initializeCompletes().subscribe();

            const op = controller.expectOne(FetchAccountDetailsDocument);
            expect(op.operation.variables.accessToken).toEqual(TEST_ACCESS_TOKEN_GITHUB);

            op.flush({
                data: mockAccountFromAccessToken,
            });

            expect(localStorageAccessTokenSpy).toHaveBeenCalledTimes(1);
        }

        function loginFullyViaGithub(): void {
            loginService.githubLogin({ code: TEST_GITHUB_CODE } as GithubLoginCredentials);

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockGithubLoginResponse,
            });
        }

        function loginFullyViaPassword(): void {
            loginService.passwordLogin({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            } as PasswordLoginCredentials);

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockPasswordLoginResponse,
            });
        }

        it("should be created", () => {
            expect(service).toBeTruthy();
        });

        it("should check user is initially non-authenticated", () => {
            expect(service.isAuthenticated).toBeFalse();
            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
        });

        it("should check user is non-authenticated if no access token exists", () => {
            const localStorageAccessTokenSpy = spyOnProperty(localStorageService, "accessToken", "get").and.returnValue(
                null,
            );
            service.initializeCompletes().subscribe();

            controller.expectNone(FetchAccountDetailsDocument);
            expect(service.isAuthenticated).toBeFalse();
            expect(localStorageAccessTokenSpy).toHaveBeenCalledTimes(1);
        });

        it("should check user changes via login with alive access token", fakeAsync(() => {
            attemptSuccessfulLoginViaAccessToken();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });
            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user changes via full login Github", fakeAsync(() => {
            const accessTokenSetSpy = spyOn(localStorageService, "setAccessToken");

            loginFullyViaGithub();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });

            expect(accessTokenSetSpy).toHaveBeenCalledWith(mockGithubLoginResponse.auth.login.accessToken);

            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user changes via full login password", fakeAsync(() => {
            const accessTokenSetSpy = spyOn(localStorageService, "setAccessToken");

            loginFullyViaPassword();
            tick();

            const userChanges$ = service.loggedInUserChanges
                .pipe(first())
                .subscribe((user: MaybeNull<AccountFragment>) => {
                    user ? checkUserIsLogged(user) : fail("User must not be null");
                });

            expect(accessTokenSetSpy).toHaveBeenCalledWith(mockPasswordLoginResponse.auth.login.accessToken);

            expect(userChanges$.closed).toBeTrue();
            flush();
        }));

        it("should check user logout navigates to home page and clears GraphQL cache", fakeAsync(() => {
            const navigationServiceSpy = spyOn(navigationService, "navigateToHome");
            const apolloClientSpy = spyOn(apollo.client, "clearStore").and.resolveTo();

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.logout();

            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).toHaveBeenCalledWith();
            expect(apolloClientSpy).toHaveBeenCalledTimes(1);
            flush();
        }));

        it("should check user terminate session does not navigate to home page", fakeAsync(() => {
            const navigationServiceSpy = spyOn(navigationService, "navigateToHome");

            attemptSuccessfulLoginViaAccessToken();
            tick();

            service.terminateSession();

            expect(service.maybeCurrentlyLoggedInUser).toBeNull();
            expect(navigationServiceSpy).not.toHaveBeenCalled();
            flush();
        }));
    });

    describe("Custom configuration", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    AuthApi,
                    Apollo,
                    {
                        provide: AppConfigService,
                        useFactory: () => {
                            const realService = new AppConfigService();
                            spyOnProperty(realService, "loginInstructions", "get").and.returnValue(
                                mockLoginInstructions,
                            );
                            return realService;
                        },
                    },
                ],
                imports: [ApolloTestingModule, HttpClientTestingModule],
            });
            service = TestBed.inject(LoggedUserService);
            controller = TestBed.inject(ApolloTestingController);

            localStorageService = TestBed.inject(LocalStorageService);
            localStorageService.reset();
        });

        it("should use custom configuration's initial user", fakeAsync(() => {
            service.initializeCompletes().subscribe();

            const op = controller.expectOne(LoginDocument);
            op.flush({
                data: mockPasswordLoginResponse,
            });

            tick();

            expect(service.isAuthenticated).toBeTrue();
            flush();
        }));
    });
});
