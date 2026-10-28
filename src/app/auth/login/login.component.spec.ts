/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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
import { requireValue } from "@common/helpers/app.helpers";
import {
    checkButtonDisabled,
    checkVisible,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
    registerMatSvgIcons,
    setFieldValue,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { AuthApi } from "@api/auth.api";
import { PasswordLoginCredentials } from "@api/auth.api.model";
import { AccountProvider } from "@api/kamu.graphql.interface";
import { mockPasswordLoginResponse, TEST_LOGIN, TEST_PASSWORD } from "@api/mock/auth.mock";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { LoginMethodsService } from "src/app/auth/login-methods.service";
import { LoginComponent } from "src/app/auth/login/login.component";
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

    enum Elements {
        METHOD_SELECTION_BLOCK = "method-selection-block",
        GITHUB_SPINNER = "github-spinner",
        PASSWORD_METHOD_BLOCK = "password-method-block",

        SELECT_METHOD_GITHUB = "select-method-github",
        SELECT_METHOD_PASSWORD = "select-method-password",
        SELECT_METHOD_WEB3_WALLET = "select-method-web3-wallet",

        INPUT_LOGIN = "input-login",
        INPUT_PASSWORD = "input-password",
        SUBMIT_PASSWORD = "submit-password",

        INPUT_LOGIN_ERROR_REQUIRED = "input-login-error-required",
        INPUT_PASSWORD_ERROR_REQUIRED = "input-password-error-required",
        PASSWORD_METHOD_ERROR = "password-method-error",
        INVALID_DEVICE_CODE = "invalid-device-code",
    }

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

        it("should not select any method with 2 login methods allowed", () => {
            expect(component.selectedLoginMethod).toBeUndefined();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, true);
            checkVisible(fixture, Elements.GITHUB_SPINNER, false);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, false);
        });

        it("select Github method should redirect to Github endpoint and show spinner", () => {
            const spyGotoGithub = vi.spyOn(loginService, "gotoGithub").mockImplementation(() => {});

            emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_GITHUB);
            fixture.detectChanges();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, false);
            checkVisible(fixture, Elements.GITHUB_SPINNER, true);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, false);

            expect(spyGotoGithub).toHaveBeenCalledTimes(1);
        });

        it("Select password method should switch on the password block and disable selection", () => {
            emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_PASSWORD);
            fixture.detectChanges();

            checkVisible(fixture, Elements.METHOD_SELECTION_BLOCK, false);
            checkVisible(fixture, Elements.GITHUB_SPINNER, false);
            checkVisible(fixture, Elements.PASSWORD_METHOD_BLOCK, true);
        });

        describe("Password login method", () => {
            beforeEach(() => {
                emitClickOnElementByDataTestId(fixture, Elements.SELECT_METHOD_PASSWORD);
                fixture.detectChanges();
            });

            it("should submit the password login form from the keyboard", () => {
                const loginServicePasswordSubmit = stubMethod(loginService, "passwordLogin");
                setFieldValue(fixture, Elements.INPUT_LOGIN, TEST_LOGIN);
                setFieldValue(fixture, Elements.INPUT_PASSWORD, TEST_PASSWORD);
                fixture.detectChanges();

                const submitButton = getElementByDataTestId(fixture, Elements.SUBMIT_PASSWORD, HTMLButtonElement);
                requireValue(submitButton.form).requestSubmit();

                expect(loginServicePasswordSubmit).toHaveBeenCalledWith(
                    { login: TEST_LOGIN, password: TEST_PASSWORD },
                    null,
                );
            });

            it("Submit good password login form", () => {
                const loginServicePasswordSubmit = vi.spyOn(loginService, "passwordLogin").mockImplementation(() => {});

                setFieldValue(fixture, Elements.INPUT_LOGIN, TEST_LOGIN);
                setFieldValue(fixture, Elements.INPUT_PASSWORD, TEST_PASSWORD);
                fixture.detectChanges();

                checkButtonDisabled(fixture, Elements.SUBMIT_PASSWORD, false);
                expect(component.passwordLoginForm.valid).toBe(true);

                emitClickOnElementByDataTestId(fixture, Elements.SUBMIT_PASSWORD);

                expect(loginServicePasswordSubmit).toHaveBeenCalledTimes(1);

                expect(loginServicePasswordSubmit).toHaveBeenCalledWith(
                    {
                        login: TEST_LOGIN,
                        password: TEST_PASSWORD,
                    },
                    null,
                );
            });

            it("Missing login or password leads to disable submit", () => {
                checkButtonDisabled(fixture, Elements.SUBMIT_PASSWORD, true);
                expect(component.passwordLoginForm.valid).toBe(false);

                setFieldValue(fixture, Elements.INPUT_LOGIN, TEST_LOGIN);
                fixture.detectChanges();

                checkButtonDisabled(fixture, Elements.SUBMIT_PASSWORD, true);
                expect(component.passwordLoginForm.valid).toBe(false);

                setFieldValue(fixture, Elements.INPUT_PASSWORD, TEST_PASSWORD);
                fixture.detectChanges();

                checkButtonDisabled(fixture, Elements.SUBMIT_PASSWORD, false);
                expect(component.passwordLoginForm.valid).toBe(true);
            });

            [
                [Elements.INPUT_LOGIN, Elements.INPUT_LOGIN_ERROR_REQUIRED],
                [Elements.INPUT_PASSWORD, Elements.INPUT_PASSWORD_ERROR_REQUIRED],
            ].forEach(([inputElementName, inputErrorElementName]: Elements[]) => {
                it(`Test touching element '${Elements.INPUT_LOGIN}' creates required error`, () => {
                    const element: MaybeUndefined<HTMLElement> = findElementByDataTestId(
                        fixture,
                        inputErrorElementName,
                    );
                    expect(element?.textContent?.trim()).toEqual("");

                    setFieldValue(fixture, inputElementName, "");
                    fixture.detectChanges();
                    expect(element?.textContent?.trim()).toBeDefined();
                });
            });

            it("Service emits an error during password login", () => {
                checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, false);

                const errorMessage = "Bad credentials";
                loginService.emitPasswordLoginErrorOccurred(errorMessage);
                fixture.detectChanges();

                checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);
            });

            [Elements.INPUT_LOGIN, Elements.INPUT_PASSWORD].forEach((inputElementName: Elements) => {
                it(`Error is cleared after touching input ${inputElementName}`, () => {
                    const errorMessage = "Bad credentials";
                    loginService.emitPasswordLoginErrorOccurred(errorMessage);
                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, true);

                    const inputElement: HTMLInputElement = getElementByDataTestId(
                        fixture,
                        inputElementName,
                        HTMLInputElement,
                    );
                    inputElement.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));

                    fixture.detectChanges();

                    checkVisible(fixture, Elements.PASSWORD_METHOD_ERROR, false);
                });
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

        it("should not keep a device code that is not a UUID, and say the link is invalid", () => {
            localStorageService.setDeviceCode("3f8e1c52-6c1d-4f7a-9b8e-2d4c6a1b0e9f");
            checkVisible(fixture, Elements.INVALID_DEVICE_CODE, false);

            mockQueryParams.next({ [ProjectLinks.URL_QUERY_PARAM_DEVICE_CODE]: "not-a-device-code" });
            fixture.detectChanges();

            expect(localStorageService.loginDeviceCode).toBeNull();
            checkVisible(fixture, Elements.INVALID_DEVICE_CODE, true);
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
