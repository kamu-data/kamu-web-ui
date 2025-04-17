/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject, map } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubLoginCredentials, LoginResponseType, PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { LoginMethod } from "src/app/app-config.model";
import { AuthenticationError } from "src/app/common/values/errors";
import { NavigationService } from "src/app/services/navigation.service";
import { AppConfigService } from "src/app/app-config.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SessionStorageService } from "src/app/services/session-storage.service";
import ProjectLinks from "src/app/project-links";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    private authApi = inject(AuthApi);
    private navigationService = inject(NavigationService);
    private appConfigService = inject(AppConfigService);
    private localStorageService = inject(LocalStorageService);
    private sessionStorageService = inject(SessionStorageService);

    private accessToken$: Subject<string> = new ReplaySubject<string>(1);
    private account$: Subject<AccountFragment> = new ReplaySubject<AccountFragment>(1);
    private passwordLoginError$: Subject<string> = new Subject<string>();

    private enabledLoginMethods: LoginMethod[] = [];

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

    public gotoGithub(): void {
        window.location.href = this.githubLoginLink();
    }

    public initialize(): Observable<void> {
        return this.authApi.readEnabledLoginMethods().pipe(
            map((enabledLoginMethods: LoginMethod[]): void => {
                this.enabledLoginMethods = enabledLoginMethods;
            }),
        );
    }

    public get loginMethods(): LoginMethod[] {
        return this.enabledLoginMethods;
    }

    public setLoginCallback(loginCallback: (loginResponse: LoginResponseType) => void): void {
        this.loginCallback = loginCallback;
    }

    public githubLogin(credentials: GithubLoginCredentials): void {
        this.authApi.fetchAccountAndTokenFromGithubCallbackCode(credentials).subscribe({
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
            error: (e) => {
                if (e instanceof AuthenticationError) {
                    this.emitPasswordLoginErrorOccurred(e.compactMessage);
                } else {
                    throw e;
                }
            },
        });
    }

    public genericLogin(loginMethod: string, loginCredentialsJson: string): Observable<void> {
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
        this.account$.next(loginResponse.account);
        const url = this.sessionStorageService.redirectAfterLoginUrl;
        this.sessionStorageService.setRedirectAfterLoginUrl(null);
        if (url && url !== `/${ProjectLinks.URL_PAGE_NOT_FOUND}`) {
            this.navigationService.navigateToPath(url);
        } else {
            this.navigationService.navigateToHome();
        }
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
