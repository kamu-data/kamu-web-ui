/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject, firstValueFrom, map } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import {
    GithubLoginCredentials,
    LoginResponseType,
    PasswordLoginCredentials,
    Web3WalletOwnershipVerificationRequest,
} from "src/app/api/auth.api.model";
import { AccountFragment, AccountProvider } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { AppConfigService } from "src/app/app-config.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { EthereumGatewayFactory } from "./ethereum/ethereum.gateway.factory";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    private authApi = inject(AuthApi);
    private navigationService = inject(NavigationService);
    private appConfigService = inject(AppConfigService);
    private localStorageService = inject(LocalStorageService);
    private ethereumGatewayFactory = inject(EthereumGatewayFactory);

    private accessToken$: Subject<string> = new ReplaySubject<string>(1);
    private account$: Subject<AccountFragment> = new ReplaySubject<AccountFragment>(1);
    private passwordLoginError$: Subject<string> = new Subject<string>();
    private accountWhitelistError$: Subject<string> = new Subject<string>();

    private loginCallback: (loginResponse: LoginResponseType) => void = this.redirectUrlLoginCallback.bind(this);

    public get accessTokenChanges(): Observable<string> {
        return this.accessToken$.asObservable();
    }

    public get accountChanges(): Observable<AccountFragment> {
        return this.account$.asObservable();
    }

    public get passwordLoginErrorOccurrences(): Observable<string> {
        return this.passwordLoginError$.asObservable();
    }

    public get accountWhitelistErrorOccurrences(): Observable<string> {
        return this.accountWhitelistError$.asObservable();
    }

    public githubLoginLink(): string {
        const githubClientId: MaybeUndefined<string> = this.appConfigService.githubClientId;
        /* istanbul ignore else */
        if (githubClientId) {
            return `https://github.com/login/oauth/authorize?scope=user:email&client_id=${githubClientId}`;
        } else {
            throw new Error("GitHub Client ID undefined in configuration");
        }
    }

    public emitPasswordLoginErrorOccurred(errorText: string): void {
        this.passwordLoginError$.next(errorText);
    }

    public emitAccountWhitelistErrorOccurred(errorText: string): void {
        this.accountWhitelistError$.next(errorText);
    }

    public gotoGithub(): void {
        window.location.href = this.githubLoginLink();
    }

    public setLoginCallback(loginCallback: (loginResponse: LoginResponseType) => void): void {
        this.loginCallback = loginCallback;
    }

    public githubLogin(credentials: GithubLoginCredentials): void {
        const deviceCode: MaybeNull<string> = this.localStorageService.loginDeviceCode;
        this.authApi.fetchAccountAndTokenFromGithubCallbackCode(credentials, deviceCode ?? undefined).subscribe({
            next: this.loginCallback,
            error: (e) => {
                this.navigationService.navigateToHome();
                throw e;
            },
        });
    }

    public passwordLogin(credentials: PasswordLoginCredentials): void {
        const deviceCode: MaybeNull<string> = this.localStorageService.loginDeviceCode;
        this.authApi.fetchAccountAndTokenFromPasswordLogin(credentials, deviceCode ?? undefined).subscribe({
            next: this.loginCallback,
        });
    }

    public async web3WalletLogin(): Promise<void> {
        const ethereumGateway = await this.ethereumGatewayFactory.create();

        const deviceCode: MaybeNull<string> = this.localStorageService.loginDeviceCode;
        await ethereumGateway.connectWallet();
        if (ethereumGateway.currentWallet) {
            const nonce = await firstValueFrom(
                this.authApi.fetchAuthNonceFromWeb3Wallet(ethereumGateway.currentWallet),
            );

            const verificationRequest: MaybeNull<Web3WalletOwnershipVerificationRequest> =
                await ethereumGateway.signInWithEthereum(nonce);
            if (verificationRequest) {
                this.authApi
                    .fetchAccountAndTokenFromWeb3Wallet(verificationRequest, deviceCode ?? undefined)
                    .subscribe({
                        next: this.loginCallback,
                    });
            }
        }
    }

    public genericLogin(loginMethod: AccountProvider, loginCredentialsJson: string): Observable<void> {
        return this.authApi.fetchAccountAndTokenFromLoginMethod(loginMethod, loginCredentialsJson).pipe(
            map((loginResponse: LoginResponseType): void => {
                this.loginCallback(loginResponse);
            }),
        );
    }

    public fetchAccountFromAccessToken(accessToken: string): Observable<void> {
        return this.authApi
            .fetchAccountFromAccessToken(accessToken)
            .pipe(map((accountDetails: AccountFragment): void => this.account$.next(accountDetails)));
    }

    public resetPasswordLoginError(): void {
        this.passwordLoginError$.next("");
    }

    private defaultLoginCallback(loginResponse: LoginResponseType): void {
        this.accessToken$.next(loginResponse.accessToken);
        this.fetchAccountFromAccessToken(loginResponse.accessToken).subscribe(() => {
            const url = this.localStorageService.redirectAfterLoginUrl;
            this.localStorageService.setRedirectAfterLoginUrl(null);
            if (url) {
                this.navigationService.navigateToPath(url);
            } else {
                this.navigationService.navigateToHome();
            }
        });
    }

    private redirectUrlLoginCallback(loginResponse: LoginResponseType): void {
        const deviceCode: MaybeNull<string> = this.localStorageService.loginDeviceCode;
        if (deviceCode) {
            this.localStorageService.setDeviceCode(null);
            this.navigationService.navigateToReturnToCli();
        } else {
            this.defaultLoginCallback(loginResponse);
        }
    }
}
