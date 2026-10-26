/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { first, of, Subscription, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { promiseWithCatch, requireValue } from "@common/helpers/app.helpers";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { RedirectUrlTestModule } from "@common/modules/redirect-url-test.module";
import { AuthenticationError } from "@common/values/errors";
import { AuthApi } from "@api/auth.api";
import { GithubLoginCredentials, LoginResponseType, PasswordLoginCredentials } from "@api/auth.api.model";
import {
    mockAccountDetails,
    mockGithubLoginResponse,
    mockPasswordLoginResponse,
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
} from "@api/mock/auth.mock";
import { MaybeUndefined } from "@interface/app.types";

import { AppConfigService } from "src/app/app-config.service";
import { EthereumGatewayFactory } from "src/app/auth/login/ethereum/ethereum.gateway.factory";
import { MockEthereumGateway, MockEthereumGatewayFactory } from "src/app/auth/login/ethereum/mock.ethereum.gateway";
import { LoginService } from "src/app/auth/login/login.service";
import ProjectLinks from "src/app/project-links";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

describe("LoginService", () => {
    let service: LoginService;
    let navigationService: NavigationService;
    let authApi: AuthApi;
    let localStorageService: LocalStorageService;
    let sessionStorageService: SessionStorageService;
    let appConfigService: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule, RedirectUrlTestModule],
            providers: [
                AuthApi,
                Apollo,
                { provide: EthereumGatewayFactory, useClass: MockEthereumGatewayFactory },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        localStorageService = TestBed.inject(LocalStorageService);
        localStorageService.reset();

        sessionStorageService = TestBed.inject(SessionStorageService);
        sessionStorageService.reset();

        service = TestBed.inject(LoginService);
        navigationService = TestBed.inject(NavigationService);
        authApi = TestBed.inject(AuthApi);
        appConfigService = TestBed.inject(AppConfigService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("successful Github login navigates to home", fakeAsync(() => {
        const authApiSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromGithubCallbackCode")
            .mockReturnValue(of(mockGithubLoginResponse.auth.login));
        const fetchAccountFromAccessTokenSpy = vi
            .spyOn(authApi, "fetchAccountFromAccessToken")
            .mockReturnValue(of(mockAccountDetails));
        const navigateSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };
        service.githubLogin(credentials, null);
        tick();

        expect(authApiSpy).toHaveBeenCalledTimes(1);

        expect(authApiSpy).toHaveBeenCalledWith(credentials, undefined);

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountFromAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(tokenSubscription$.closed).toBe(true);
        expect(accountSubscription$.closed).toBe(true);
        flush();
    }));

    it("failed Github login navigates to home, but throws an error", fakeAsync(() => {
        const errorText = "Unsupported login method";
        const exception = new AuthenticationError([new Error(errorText)]);

        const authApiSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromGithubCallbackCode")
            .mockReturnValue(throwError(() => exception));
        const navigateSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };

        expect(() => {
            service.githubLogin(credentials, null);
            tick();
        }).toThrow(exception);

        expect(authApiSpy).toHaveBeenCalledTimes(1);

        expect(authApiSpy).toHaveBeenCalledWith(credentials, undefined);
        expect(navigateSpy).toHaveBeenCalledTimes(1);

        expect(tokenSubscription$.closed).toBe(false);
        expect(accountSubscription$.closed).toBe(false);
        tokenSubscription$.unsubscribe();
        accountSubscription$.unsubscribe();
    }));

    it("successful password login navigates to home", () => {
        const authApiSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin")
            .mockReturnValue(of(mockPasswordLoginResponse.auth.login));
        const fetchAccountFromAccessTokenSpy = vi
            .spyOn(authApi, "fetchAccountFromAccessToken")
            .mockReturnValue(of(mockAccountDetails));
        const navigateSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials, null);

        expect(authApiSpy).toHaveBeenCalledTimes(1);

        expect(authApiSpy).toHaveBeenCalledWith(credentials, undefined);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountFromAccessTokenSpy).toHaveBeenCalledTimes(1);

        expect(tokenSubscription$.closed).toBe(true);
        expect(accountSubscription$.closed).toBe(true);
    });

    it("resetting password login error emits empty error", () => {
        const errorSubscription$: Subscription = service.passwordLoginErrorOccurrences
            .pipe(first())
            .subscribe((e: string) => {
                expect(e).toEqual("");
            });

        service.resetPasswordLoginError();

        expect(errorSubscription$.closed).toBe(true);
    });

    it("custom login callback", () => {
        let callbackLoginResponse: MaybeUndefined<LoginResponseType>;

        service.setLoginCallback((loginResponse: LoginResponseType) => {
            callbackLoginResponse = loginResponse;
        });

        const authApiSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin")
            .mockReturnValue(of(mockPasswordLoginResponse.auth.login));
        const navigateSpy = vi.spyOn(navigationService, "navigateToHome").mockImplementation(() => {});

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials, null);

        expect(callbackLoginResponse).toEqual(mockPasswordLoginResponse.auth.login);

        expect(authApiSpy).toHaveBeenCalledTimes(1);

        expect(authApiSpy).toHaveBeenCalledWith(credentials, undefined);
        expect(navigateSpy).not.toHaveBeenCalled();

        expect(tokenSubscription$.closed).toBe(false);
        expect(accountSubscription$.closed).toBe(false);
        tokenSubscription$.unsubscribe();
        accountSubscription$.unsubscribe();
    });

    it("should start a GitHub sign-in with a random state stored together with the redirect URL", () => {
        vi.spyOn(appConfigService, "githubClientId", "get").mockReturnValue("mockId");
        const deepLink = "/kamu/dataset?tab=flows&page=2";

        const githubUrl = new URL(service.startGithubLogin(deepLink));
        const pendingLogin = sessionStorageService.takeGithubLoginState();

        expect(`${githubUrl.origin}${githubUrl.pathname}`).toEqual("https://github.com/login/oauth/authorize");
        expect(githubUrl.searchParams.get("client_id")).toEqual("mockId");
        expect(githubUrl.searchParams.get(ProjectLinks.URL_QUERY_PARAM_STATE)).toMatch(/^[0-9a-f]{32}$/);
        expect(githubUrl.searchParams.get(ProjectLinks.URL_QUERY_PARAM_STATE)).toEqual(pendingLogin?.state ?? null);
        expect(pendingLogin?.redirectUrl).toEqual(deepLink);
        expect(githubUrl.searchParams.has("redirect_uri")).toBe(false);
        expect(githubUrl.searchParams.has("page")).toBe(false);
    });

    it("should give every GitHub sign-in a new state", () => {
        vi.spyOn(appConfigService, "githubClientId", "get").mockReturnValue("mockId");

        const firstState = new URL(service.startGithubLogin(null)).searchParams.get(ProjectLinks.URL_QUERY_PARAM_STATE);
        const secondState = new URL(service.startGithubLogin(null)).searchParams.get(
            ProjectLinks.URL_QUERY_PARAM_STATE,
        );

        expect(secondState).not.toEqual(firstState);
        expect(sessionStorageService.takeGithubLoginState()).toEqual({
            state: requireValue(secondState),
            redirectUrl: null,
        });
    });

    it("should successfully complete web3 wallet login flow", fakeAsync(() => {
        const mockNonce = "mock-nonce-12345";
        const expectedVerificationRequest = {
            signature: `${MockEthereumGateway.SIGNATURE_PREFIX}${mockNonce}`,
            message: MockEthereumGateway.MESSAGE,
        };

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        const fetchAuthNonceSpy = vi.spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").mockReturnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet")
            .mockReturnValue(of(mockPasswordLoginResponse.auth.login));

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledTimes(1);

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledWith(expectedVerificationRequest, undefined);
        expect(interceptedLoginResponse).toEqual(mockPasswordLoginResponse.auth.login);
        flush();
    }));

    it("should handle web3 wallet login with device code", fakeAsync(() => {
        const mockDeviceCode = "mock-device-code-123";
        const mockNonce = "mock-nonce-12345";
        const expectedVerificationRequest = {
            signature: `${MockEthereumGateway.SIGNATURE_PREFIX}${mockNonce}`,
            message: MockEthereumGateway.MESSAGE,
        };

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        vi.spyOn(localStorageService, "loginDeviceCode", "get").mockReturnValue(mockDeviceCode);
        const fetchAuthNonceSpy = vi.spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").mockReturnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = vi
            .spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet")
            .mockReturnValue(of(mockPasswordLoginResponse.auth.login));

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledTimes(1);

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledWith(expectedVerificationRequest, mockDeviceCode);
        expect(interceptedLoginResponse).toEqual(mockPasswordLoginResponse.auth.login);
        flush();
    }));

    it("should handle web3 wallet login when no wallet is connected", fakeAsync(() => {
        // Arrange: Create a mock that simulates no wallet connection
        const ethereumGatewayFactory = TestBed.inject(EthereumGatewayFactory);
        const mockGateway = new MockEthereumGateway();
        mockGateway.walletToConnectTo = null; // Simulate no wallet connected

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        vi.spyOn(ethereumGatewayFactory, "create").mockResolvedValue(mockGateway);
        const fetchAuthNonceSpy = stubMethod(authApi, "fetchAuthNonceFromWeb3Wallet");
        const fetchAccountAndTokenSpy = stubMethod(authApi, "fetchAccountAndTokenFromWeb3Wallet");

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).not.toHaveBeenCalled();
        expect(fetchAccountAndTokenSpy).not.toHaveBeenCalled();
        expect(interceptedLoginResponse).toBeUndefined();
        flush();
    }));

    it("should handle web3 wallet login when verification request is null", fakeAsync(() => {
        // Arrange: Create a mock that returns null for signInWithEthereum
        const ethereumGatewayFactory = TestBed.inject(EthereumGatewayFactory);
        const mockGateway = new MockEthereumGateway();
        const mockNonce = "mock-nonce-12345";
        const signInWithEthereumSpy = vi.fn().mockResolvedValue(null);
        mockGateway.signInWithEthereum = signInWithEthereumSpy;

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        vi.spyOn(ethereumGatewayFactory, "create").mockResolvedValue(mockGateway);
        const fetchAuthNonceSpy = vi.spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").mockReturnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = stubMethod(authApi, "fetchAccountAndTokenFromWeb3Wallet");

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledTimes(1);

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(signInWithEthereumSpy).toHaveBeenCalledTimes(1);
        expect(signInWithEthereumSpy).toHaveBeenCalledWith(mockNonce);
        expect(fetchAccountAndTokenSpy).not.toHaveBeenCalled();
        expect(interceptedLoginResponse).toBeUndefined();
        flush();
    }));

    // Remove the separate custom callback test since it's now covered in the other tests
});
