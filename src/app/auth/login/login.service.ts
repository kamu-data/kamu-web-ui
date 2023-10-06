import { Injectable } from "@angular/core";
import { Observable, ReplaySubject, Subject, map } from "rxjs";
import { AuthApi } from "src/app/api/auth.api";
import { GithubLoginCredentials, PasswordLoginCredentials } from "src/app/api/auth.api.model";
import { AccountFragment, LoginResponse } from "src/app/api/kamu.graphql.interface";
import { LoginMethod } from "src/app/app-config.model";
import { AuthenticationError } from "src/app/common/errors";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { LoginCallbackResponse } from "./login.component.model";
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from "src/app/app-config.service";
import { MaybeNull } from "src/app/common/app.types";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Injectable({
    providedIn: "root",
})
export class LoginService {
    public constructor(
        private authApi: AuthApi,
        private navigationService: NavigationService,
        private appConfigService: AppConfigService,
        private localStorageService: LocalStorageService,
        private httpClient: HttpClient,
    ) {}

    private accessToken$: Subject<string> = new ReplaySubject<string>(1);
    private account$: Subject<AccountFragment> = new ReplaySubject<AccountFragment>(1);
    private passwordLoginError$: Subject<string> = new Subject<string>();

    private enabledLoginMethods: LoginMethod[] = [];

    private loginCallback: (loginResponse: LoginResponse) => void = this.redirectUrlLoginCallback.bind(this);

    public get accessTokenChanges(): Observable<string> {
        return this.accessToken$.asObservable();
    }

    public get accountChanges(): Observable<AccountFragment> {
        return this.account$.asObservable();
    }

    public get passwordLoginErrorOccurrences(): Observable<string> {
        return this.passwordLoginError$.asObservable();
    }

    public emitPasswordLoginErrorOccurred(errorText: string): void {
        this.passwordLoginError$.next(errorText);
    }

    public static gotoGithub(): void {
        window.location.href = ProjectLinks.GITHUB_URL;
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

    public setLoginCallback(loginCallback: (loginResponse: LoginResponse) => void): void {
        this.loginCallback = loginCallback;
    }

    public githubLogin(credentials: GithubLoginCredentials): void {
        this.authApi.fetchAccountAndTokenFromGithubCallackCode(credentials).subscribe({
            next: this.loginCallback,
            error: (e) => {
                this.navigationService.navigateToHome();
                throw e;
            },
        });
    }

    public passwordLogin(credentials: PasswordLoginCredentials): void {
        this.authApi.fetchAccountAndTokenFromPasswordLogin(credentials).subscribe({
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
            map((loginResponse: LoginResponse): void => {
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

    private defaultLoginCallback(loginResponse: LoginResponse): void {
        this.accessToken$.next(loginResponse.accessToken);
        this.account$.next(loginResponse.account);
        this.navigationService.navigateToHome();
    }

    private redirectUrlLoginCallback(loginResponse: LoginResponse): void {
        const callbackUrl: MaybeNull<string> = this.localStorageService.loginCallbackUrl;
        if (callbackUrl) {
            this.localStorageService.setLoginCallbackUrl(null);

            const response: LoginCallbackResponse = {
                accessToken: loginResponse.accessToken,
                backendUrl: this.appConfigService.apiServerUrl,
            };
            this.httpClient.post<LoginCallbackResponse>(callbackUrl, response).subscribe(() => {
                this.navigationService.navigateToReturnToCli();
            });
        } else {
            this.defaultLoginCallback(loginResponse);
        }
    }
}
