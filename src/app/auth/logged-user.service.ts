import { Injectable } from "@angular/core";
import { first } from "rxjs/operators";
import { Observable, ReplaySubject, Subject, of } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import AppValues from "../common/app.values";
import { MaybeNull } from "../common/app.types";
import { isNull } from "lodash";
import { AppConfigService } from "../app-config.service";
import { AuthApi } from "../api/auth.api";
import { AccountFragment } from "../api/kamu.graphql.interface";
import { UnsubscribeOnDestroyAdapter } from "../common/unsubscribe.ondestroy.adapter";
import { AppConfigLoginInstructions } from "../app-config.model";
import { Apollo } from "apollo-angular";
import { promiseWithCatch } from "../common/app.helpers";

@Injectable({
    providedIn: "root",
})
export class LoggedUserService extends UnsubscribeOnDestroyAdapter {
    private loggedInUser: MaybeNull<AccountFragment> = null;

    private loggedInUserChanges$: Subject<MaybeNull<AccountFragment>> = new ReplaySubject<MaybeNull<AccountFragment>>(
        1,
    );

    constructor(
        private authApi: AuthApi,
        private navigationService: NavigationService,
        private appConfigService: AppConfigService,
        private apollo: Apollo,
    ) {
        super();

        this.trackSubscriptions(
            this.authApi.accessTokenObtained().subscribe((token: string) => this.saveAccessToken(token)),
            this.authApi.accountChanged().subscribe((user: AccountFragment) => this.changeUser(user)),
        );
    }

    public initialize(): Observable<void> {
        const loginInstructions: AppConfigLoginInstructions | null = this.appConfigService.loginInstructions;
        if (loginInstructions) {
            return this.authApi.fetchAccountAndTokenFromLoginMethod(
                loginInstructions.loginMethod,
                loginInstructions.loginCredentialsJson,
            );
        } else {
            return this.attemptPreviousAuthentication();
        }
    }

    public get onLoggedInUserChanges(): Observable<MaybeNull<AccountFragment>> {
        return this.loggedInUserChanges$.asObservable();
    }

    public get currentlyLoggedInUser(): MaybeNull<AccountFragment> {
        return this.loggedInUser;
    }

    public get isAuthenticated(): boolean {
        return !isNull(this.loggedInUser);
    }

    public logout(): void {
        this.terminateSession();
        this.navigationService.navigateToHome();
    }

    public terminateSession(): void {
        this.changeUser(null);
        this.resetAccessToken();
        this.clearGraphQLCache();
    }

    private attemptPreviousAuthentication(): Observable<void> {
        const accessToken: string | null = localStorage.getItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        if (typeof accessToken === "string" && !this.isAuthenticated) {
            return this.authApi.fetchAccountFromAccessToken(accessToken).pipe(first());
        } else {
            return of(void {});
        }
    }

    private changeUser(user: MaybeNull<AccountFragment>) {
        this.loggedInUser = user;
        this.loggedInUserChanges$.next(user);
    }

    private clearGraphQLCache(): void {
        promiseWithCatch(this.apollo.client.clearStore());
    }

    private resetAccessToken(): void {
        localStorage.removeItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
    }

    private saveAccessToken(token: string): void {
        localStorage.setItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN, token);
    }
}