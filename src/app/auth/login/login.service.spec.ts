/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { first, of, Subscription, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AppConfigService } from "src/app/app-config.service";
import { EthereumGatewayFactory } from "src/app/auth/login/ethereum/ethereum.gateway.factory";
import { MockEthereumGateway, MockEthereumGatewayFactory } from "src/app/auth/login/ethereum/mock.ethereum.gateway";
import { LoginService } from "src/app/auth/login/login.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { NavigationService } from "src/app/services/navigation.service";
import { SessionStorageService } from "src/app/services/session-storage.service";

import { promiseWithCatch } from "@common/helpers/app.helpers";
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
                provideHttpClient(withInterceptorsFromDi()),
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
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromGithubCallbackCode").and.returnValue(
            of(mockGithubLoginResponse.auth.login),
        );
        const fetchAccountFromAccessTokenSpy = spyOn(authApi, "fetchAccountFromAccessToken").and.returnValue(
            of(mockAccountDetails),
        );
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };
        service.githubLogin(credentials, null);
        tick();

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountFromAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(tokenSubscription$.closed).toBeTrue();
        expect(accountSubscription$.closed).toBeTrue();
        flush();
    }));

    it("failed Github login navigates to home, but throws an error", fakeAsync(() => {
        const errorText = "Unsupported login method";
        const exception = new AuthenticationError([new Error(errorText)]);

        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromGithubCallbackCode").and.returnValue(
            throwError(() => exception),
        );
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: GithubLoginCredentials = { code: TEST_GITHUB_CODE };

        expect(() => {
            service.githubLogin(credentials, null);
            tick();
        }).toThrow(exception);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);
        expect(navigateSpy).toHaveBeenCalledTimes(1);

        expect(tokenSubscription$.closed).toBeFalse();
        expect(accountSubscription$.closed).toBeFalse();
        tokenSubscription$.unsubscribe();
        accountSubscription$.unsubscribe();
    }));

    it("successful password login navigates to home", () => {
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(
            of(mockPasswordLoginResponse.auth.login),
        );
        const fetchAccountFromAccessTokenSpy = spyOn(authApi, "fetchAccountFromAccessToken").and.returnValue(
            of(mockAccountDetails),
        );
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials, null);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountFromAccessTokenSpy).toHaveBeenCalledTimes(1);

        expect(tokenSubscription$.closed).toBeTrue();
        expect(accountSubscription$.closed).toBeTrue();
    });

    it("resetting password login error emits empty error", () => {
        const errorSubscription$: Subscription = service.passwordLoginErrorOccurrences
            .pipe(first())
            .subscribe((e: string) => {
                expect(e).toEqual("");
            });

        service.resetPasswordLoginError();

        expect(errorSubscription$.closed).toBeTrue();
    });

    it("custom login callback", () => {
        let callbackLoginResponse: MaybeUndefined<LoginResponseType>;

        service.setLoginCallback((loginResponse: LoginResponseType) => {
            callbackLoginResponse = loginResponse;
        });

        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(
            of(mockPasswordLoginResponse.auth.login),
        );
        const navigateSpy = spyOn(navigationService, "navigateToHome");

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials, null);

        expect(callbackLoginResponse).toEqual(mockPasswordLoginResponse.auth.login);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);
        expect(navigateSpy).not.toHaveBeenCalled();

        expect(tokenSubscription$.closed).toBeFalse();
        expect(accountSubscription$.closed).toBeFalse();
        tokenSubscription$.unsubscribe();
        accountSubscription$.unsubscribe();
    });

    it("should check githubLoginLink method", () => {
        spyOnProperty(appConfigService, "githubClientId", "get").and.returnValue("mockId");
        expect(
            service
                .githubLoginLink(null)
                .includes("https://github.com/login/oauth/authorize?scope=user:email&client_id=mockId"),
        ).toEqual(true);
    });

    it("should successfully complete web3 wallet login flow", fakeAsync(() => {
        const mockNonce = "mock-nonce-12345";
        const expectedVerificationRequest = {
            walletAddress: MockEthereumGateway.WALLET_ADDRESS,
            signature: `${MockEthereumGateway.SIGNATURE_PREFIX}${mockNonce}`,
            message: MockEthereumGateway.MESSAGE,
        };

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        const fetchAuthNonceSpy = spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").and.returnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet").and.returnValue(
            of(mockPasswordLoginResponse.auth.login),
        );

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledOnceWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledOnceWith(expectedVerificationRequest, undefined);
        expect(interceptedLoginResponse).toEqual(mockPasswordLoginResponse.auth.login);
        flush();
    }));

    it("should handle web3 wallet login with device code", fakeAsync(() => {
        const mockDeviceCode = "mock-device-code-123";
        const mockNonce = "mock-nonce-12345";
        const expectedVerificationRequest = {
            walletAddress: MockEthereumGateway.WALLET_ADDRESS,
            signature: `${MockEthereumGateway.SIGNATURE_PREFIX}${mockNonce}`,
            message: MockEthereumGateway.MESSAGE,
        };

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        spyOnProperty(localStorageService, "loginDeviceCode", "get").and.returnValue(mockDeviceCode);
        const fetchAuthNonceSpy = spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").and.returnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet").and.returnValue(
            of(mockPasswordLoginResponse.auth.login),
        );

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledOnceWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(fetchAccountAndTokenSpy).toHaveBeenCalledOnceWith(expectedVerificationRequest, mockDeviceCode);
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

        spyOn(ethereumGatewayFactory, "create").and.resolveTo(mockGateway);
        const fetchAuthNonceSpy = spyOn(authApi, "fetchAuthNonceFromWeb3Wallet");
        const fetchAccountAndTokenSpy = spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet");

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
        const signInWithEthereumSpy = jasmine.createSpy("signInWithEthereum").and.resolveTo(null);
        mockGateway.signInWithEthereum = signInWithEthereumSpy;

        let interceptedLoginResponse: MaybeUndefined<LoginResponseType>;
        service.setLoginCallback((loginResponse: LoginResponseType) => {
            interceptedLoginResponse = loginResponse;
        });

        spyOn(ethereumGatewayFactory, "create").and.resolveTo(mockGateway);
        const fetchAuthNonceSpy = spyOn(authApi, "fetchAuthNonceFromWeb3Wallet").and.returnValue(of(mockNonce));
        const fetchAccountAndTokenSpy = spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet");

        // Act
        promiseWithCatch(service.web3WalletLogin(null));
        tick();

        // Assert
        expect(fetchAuthNonceSpy).toHaveBeenCalledOnceWith(MockEthereumGateway.WALLET_ADDRESS);
        expect(signInWithEthereumSpy).toHaveBeenCalledOnceWith(mockNonce);
        expect(fetchAccountAndTokenSpy).not.toHaveBeenCalled();
        expect(interceptedLoginResponse).toBeUndefined();
        flush();
    }));

    // Remove the separate custom callback test since it's now covered in the other tests
});
