/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { AuthApi } from "src/app/api/auth.api";
import { NavigationService } from "src/app/services/navigation.service";
import { LoginService } from "./login.service";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Subscription, first, of, throwError } from "rxjs";
import {
    TEST_GITHUB_CODE,
    TEST_LOGIN,
    TEST_PASSWORD,
    mockAccountDetails,
    mockGithubLoginResponse,
    mockPasswordLoginResponse,
} from "src/app/api/mock/auth.mock";
import { GithubLoginCredentials, LoginResponseType, PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { AuthenticationError } from "src/app/common/values/errors";
import { MaybeUndefined } from "src/app/interface/app.types";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { AppConfigService } from "src/app/app-config.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import { Eip1193EthereumService } from "./ethereum.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";

describe("LoginService", () => {
    let service: LoginService;
    let navigationService: NavigationService;
    let authApi: AuthApi;
    let localStorageService: LocalStorageService;
    let sessionStorageService: SessionStorageService;
    let appConfigService: AppConfigService;
    let ethereumService: Eip1193EthereumService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule, HttpClientTestingModule],
        });

        localStorageService = TestBed.inject(LocalStorageService);
        localStorageService.reset();

        sessionStorageService = TestBed.inject(SessionStorageService);
        sessionStorageService.reset();

        service = TestBed.inject(LoginService);
        navigationService = TestBed.inject(NavigationService);
        authApi = TestBed.inject(AuthApi);
        appConfigService = TestBed.inject(AppConfigService);
        ethereumService = TestBed.inject(Eip1193EthereumService);
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
        service.githubLogin(credentials);
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
            service.githubLogin(credentials);
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
        service.passwordLogin(credentials);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountFromAccessTokenSpy).toHaveBeenCalledTimes(1);

        expect(tokenSubscription$.closed).toBeTrue();
        expect(accountSubscription$.closed).toBeTrue();
    });

    it("failed password login emits an error", () => {
        const errorText = "Rejected credentials";
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromPasswordLogin").and.returnValue(
            throwError(() => new AuthenticationError([new Error(errorText)])),
        );

        const errorSubscription$: Subscription = service.passwordLoginErrorOccurrences
            .pipe(first())
            .subscribe((e: string) => {
                expect(e).toEqual(errorText);
            });

        const tokenSubscription$ = service.accessTokenChanges.pipe(first()).subscribe();
        const accountSubscription$ = service.accountChanges.pipe(first()).subscribe();

        const credentials: PasswordLoginCredentials = { login: TEST_LOGIN, password: TEST_PASSWORD };
        service.passwordLogin(credentials);

        expect(authApiSpy).toHaveBeenCalledOnceWith(credentials, undefined);
        expect(errorSubscription$.closed).toBeTrue();

        expect(tokenSubscription$.closed).toBeFalse();
        expect(accountSubscription$.closed).toBeFalse();
        tokenSubscription$.unsubscribe();
        accountSubscription$.unsubscribe();
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
        service.passwordLogin(credentials);

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
                .githubLoginLink()
                .includes("https://github.com/login/oauth/authorize?scope=user:email&client_id=mockId"),
        ).toEqual(true);
    });

    it("should check web3 wallet login", fakeAsync(() => {
        const connectWalletSpy = spyOn(ethereumService, "connectWallet");
        spyOnProperty(ethereumService, "currentWalet", "get").and.returnValue("test_wallet0xsawwwW");
        const mockVerificationRequest = { message: "", signature: "" };
        const mockPromise = Promise.resolve(mockVerificationRequest);
        spyOn(ethereumService, "signInWithEthereum").and.returnValue(mockPromise);
        const authApiSpy = spyOn(authApi, "fetchAccountAndTokenFromWeb3Wallet").and.returnValue(of());

        promiseWithCatch(service.web3WalletLogin());
        tick();

        expect(connectWalletSpy).toHaveBeenCalledOnceWith();
        expect(authApiSpy).toHaveBeenCalledTimes(1);
    }));
});
