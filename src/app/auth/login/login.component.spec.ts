/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, convertToParamMap, Params } from "@angular/router";

import { BehaviorSubject, map, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import type { Mock } from "vitest";

import { SpinnerComponent } from "@common/components/spinner/spinner/spinner.component";
import { registerMatSvgIcons, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { AuthApi } from "@api/auth.api";
import { PasswordLoginCredentials } from "@api/auth.api.model";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockPasswordLoginResponse, TEST_LOGIN, TEST_PASSWORD } from "@api/mock/auth.mock";
import { MaybeNull } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { LoginComponent } from "src/app/auth/login/login.component";
import { LoginHarness } from "src/app/auth/login/login.harness";
import { LoginService } from "src/app/auth/login/login.service";
import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let appConfigService: AppConfigService;
    let loginService: LoginService;
    let loginMethodsService: LoginMethodsService;
    let navigationService: NavigationService;
    let localStorageService: LocalStorageService;
    let authApi: AuthApi;

    const MOCK_FEATURE_FLAGS = {
        enableLogout: true,
        enableScheduling: true,
        enableDatasetEnvVarsManagement: true,
        enableTermsOfService: true,
        allowAnonymous: true,
    };

    const mockQueryParams: BehaviorSubject<Params> = new BehaviorSubject<Params>({});

    let redirectUrlParam: MaybeNull<string>;

    beforeEach(async () => {
        mockQueryParams.next({});
        redirectUrlParam = null;

        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, ReactiveFormsModule, MatIconModule, LoginComponent, SpinnerComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParamMap: mockQueryParams.pipe(map((params) => convertToParamMap(params))),
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL:
                                            return redirectUrlParam;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        localStorageService = TestBed.inject(LocalStorageService);
        localStorageService.reset();

        loginService = TestBed.inject(LoginService);
        loginMethodsService = TestBed.inject(LoginMethodsService);
        navigationService = TestBed.inject(NavigationService);

        authApi = TestBed.inject(AuthApi);
    });

    function createFixture() {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe("Main test suite", () => {
        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService);
            vi.spyOn(appConfigService, "featureFlags", "get").mockReturnValue(MOCK_FEATURE_FLAGS);
            vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([
                AccountProvider.OauthGithub,
                AccountProvider.Password,
                AccountProvider.Web3Wallet,
            ]);

            createFixture();
        });

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        function loginHarness(): Promise<LoginHarness> {
            return TestbedHarnessEnvironment.harnessForFixture(fixture, LoginHarness);
        }

        it("should not select any method with 2 login methods allowed", async () => {
            const login = await loginHarness();

            expect(component.selectedLoginMethod).toBeUndefined();
            expect(await login.isMethodSelectionShown()).toBe(true);
            expect(await login.isGithubSpinnerShown()).toBe(false);
            expect(await login.isPasswordFormShown()).toBe(false);
        });

        it("select Github method should redirect to Github endpoint and show spinner", async () => {
            const spyGotoGithub = stubMethod(loginService, "gotoGithub");
            const login = await loginHarness();

            await login.selectGithub();

            expect(await login.isMethodSelectionShown()).toBe(false);
            expect(await login.isGithubSpinnerShown()).toBe(true);
            expect(await login.isPasswordFormShown()).toBe(false);
            expect(spyGotoGithub).toHaveBeenCalledTimes(1);
        });

        it("Select password method should switch on the password block and disable selection", async () => {
            const login = await loginHarness();

            await login.selectPassword();

            expect(await login.isMethodSelectionShown()).toBe(false);
            expect(await login.isGithubSpinnerShown()).toBe(false);
            expect(await login.isPasswordFormShown()).toBe(true);
        });

        describe("Password login method", () => {
            let login: LoginHarness;

            beforeEach(async () => {
                login = await loginHarness();
                await login.selectPassword();
            });

            it("should submit the password login form from the keyboard", async () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");
                await login.setLogin(TEST_LOGIN);
                await login.setPassword(TEST_PASSWORD);

                await login.submitForm();

                expect(loginServicePasswordSubmit).toHaveBeenCalledWith(
                    { login: TEST_LOGIN, password: TEST_PASSWORD },
                    null,
                );
            });

            it("should not submit from the keyboard without a password, and show why", async () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");
                await login.setLogin(TEST_LOGIN);

                await login.submitForm();

                expect(loginServicePasswordSubmit).not.toHaveBeenCalled();
                expect(await login.getPasswordError()).toBe("Password is required");
            });

            it("Submit good password login form", async () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");

                await login.setLogin(TEST_LOGIN);
                await login.setPassword(TEST_PASSWORD);

                expect(await login.getLoginError()).toBeNull();
                expect(await login.getPasswordError()).toBeNull();
                expect(await login.isSubmitDisabled()).toBe(false);
                await login.submit();

                expect(loginServicePasswordSubmit).toHaveBeenCalledTimes(1);
                expect(loginServicePasswordSubmit).toHaveBeenCalledWith(
                    { login: TEST_LOGIN, password: TEST_PASSWORD },
                    null,
                );
            });

            it("should trim the login", async () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");

                await login.setLogin(`  ${TEST_LOGIN} `);
                await login.setPassword(TEST_PASSWORD);
                await login.submit();

                expect(loginServicePasswordSubmit).toHaveBeenCalledWith(
                    { login: TEST_LOGIN, password: TEST_PASSWORD },
                    null,
                );
            });

            it("Missing login or password leads to disable submit", async () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");
                expect(await login.isSubmitDisabled()).toBe(true);

                await login.setLogin(TEST_LOGIN);
                expect(await login.isSubmitDisabled()).toBe(true);
                await login.submit();
                expect(loginServicePasswordSubmit).not.toHaveBeenCalled();

                await login.setPassword(TEST_PASSWORD);
                expect(await login.isSubmitDisabled()).toBe(false);
            });

            it("should require a login", async () => {
                expect(await login.getLoginError()).toBeNull();

                await login.setLogin("");

                expect(await login.getLoginError()).toBe("Login is required");
                expect(await login.isSubmitDisabled()).toBe(true);
            });

            it("should require a password", async () => {
                expect(await login.getPasswordError()).toBeNull();

                await login.setPassword("");

                expect(await login.getPasswordError()).toBe("Password is required");
                expect(await login.isSubmitDisabled()).toBe(true);
            });

            it("Service emits an error during password login", async () => {
                expect(await login.getLoginFailure()).toBeNull();

                loginService.emitPasswordLoginErrorOccurred("Bad credentials");

                expect(await login.getLoginFailure()).toBe("Bad credentials");
            });

            it("should clear the login failure once the login is edited", async () => {
                loginService.emitPasswordLoginErrorOccurred("Bad credentials");

                await login.setLogin(TEST_LOGIN);

                expect(await login.getLoginFailure()).toBeNull();
            });

            it("should clear the login failure once the password is edited", async () => {
                loginService.emitPasswordLoginErrorOccurred("Bad credentials");

                await login.setPassword(TEST_PASSWORD);

                expect(await login.getLoginFailure()).toBeNull();
            });
        });

        it("login callback setup in localStorage via query parameter", () => {
            const SOME_DEVICE_CODE = "3f8e1c52-6c1d-4f7a-9b8e-2d4c6a1b0e9f";
            mockQueryParams.next({
                [ProjectLinks.URL_QUERY_PARAM_DEVICE_CODE]: SOME_DEVICE_CODE,
            });
            fixture.detectChanges();

            const authApiSpy = vi
                .spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin")
                .mockReturnValue(of(mockPasswordLoginResponse.auth.login));
            const navigationSpy = vi.spyOn(navigationService, "navigateToReturnToCli").mockImplementation(() => {});

            const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
            loginService.passwordLogin(credentials, null);

            expect(authApiSpy).toHaveBeenCalledTimes(1);

            expect(authApiSpy).toHaveBeenCalledWith(credentials, SOME_DEVICE_CODE);
            expect(navigationSpy).toHaveBeenCalledTimes(1);
        });

        it("should not keep a device code that is not a UUID, and say the link is invalid", async () => {
            localStorageService.setDeviceCode("3f8e1c52-6c1d-4f7a-9b8e-2d4c6a1b0e9f");
            const login = await loginHarness();
            expect(await login.isInvalidDeviceCodeShown()).toBe(false);

            mockQueryParams.next({ [ProjectLinks.URL_QUERY_PARAM_DEVICE_CODE]: "not-a-device-code" });

            expect(localStorageService.loginDeviceCode).toBeNull();
            expect(await login.isInvalidDeviceCodeShown()).toBe(true);
        });
    });

    [AccountProvider.OauthGithub, AccountProvider.Password, AccountProvider.Web3Wallet].forEach(
        (loginMethod: AccountProvider) => {
            describe("One-method-config", () => {
                let spyGotoGithub: Mock;

                beforeEach(() => {
                    appConfigService = TestBed.inject(AppConfigService);
                    vi.spyOn(appConfigService, "featureFlags", "get").mockReturnValue(MOCK_FEATURE_FLAGS);
                    vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([loginMethod]);

                    spyGotoGithub = vi.spyOn(loginService, "gotoGithub").mockImplementation(() => {});

                    createFixture();
                });

                it("should auto-select the only available method", () => {
                    expect(component.selectedLoginMethod).toEqual(loginMethod);

                    switch (loginMethod) {
                        case AccountProvider.OauthGithub:
                            expect(spyGotoGithub).toHaveBeenCalledTimes(1);
                            break;

                        case AccountProvider.Password:
                        case AccountProvider.Web3Wallet:
                            expect(spyGotoGithub).not.toHaveBeenCalled();
                            break;
                    }
                });
            });
        },
    );

    describe("Zero-method-config", () => {
        beforeEach(() => {
            appConfigService = TestBed.inject(AppConfigService);
            vi.spyOn(appConfigService, "featureFlags", "get").mockReturnValue(MOCK_FEATURE_FLAGS);
            vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([]);
        });

        it("component should throw error", () => {
            expect(() => createFixture()).toThrow(new Error(LoginComponent.ERROR_ZERO_METHODS_IN_CONFIG));
        });
    });

    describe("redirect URL", () => {
        beforeEach(() => {
            vi.spyOn(loginMethodsService, "loginMethods", "get").mockReturnValue([AccountProvider.Password]);
            localStorageService.setAccessToken("some-token");
        });

        it("should return a signed-in user to a page inside the app", () => {
            const navigateSpy = stubMethod(navigationService, "navigateToReplacedPath");
            redirectUrlParam = "/kamu/dataset?page=2";

            createFixture();

            expect(navigateSpy).toHaveBeenCalledWith("/kamu/dataset?page=2");
        });

        ["//evil.example/path", "/\\evil.example", "https://evil.example", "kamu/dataset"].forEach((url) => {
            it(`should ignore "${url}", which is not a path inside the app`, () => {
                const navigateSpy = stubMethod(navigationService, "navigateToReplacedPath");
                redirectUrlParam = url;

                createFixture();

                expect(navigateSpy).not.toHaveBeenCalled();
            });
        });
    });
});
