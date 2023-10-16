import { Injectable } from "@angular/core";
import { catchError, first } from "rxjs/operators";
import { Observable, ReplaySubject, Subject, of } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import { MaybeNull } from "../common/app.types";
import { isNull } from "lodash";
import { AppConfigService } from "../app-config.service";
import { AccountFragment } from "../api/kamu.graphql.interface";
import { UnsubscribeOnDestroyAdapter } from "../common/unsubscribe.ondestroy.adapter";
import { AppConfigLoginInstructions } from "../app-config.model";
import { Apollo } from "apollo-angular";
import { promiseWithCatch } from "../common/app.helpers";
import { LoginService } from "./login/login.service";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable({
    providedIn: "root",
})
export class LoggedUserService extends UnsubscribeOnDestroyAdapter {
    private loggedInUser: MaybeNull<AccountFragment> = null;

    private loggedInUser$: Subject<MaybeNull<AccountFragment>> = new ReplaySubject<MaybeNull<AccountFragment>>(1);

    constructor(
        private loginService: LoginService,
        private navigationService: NavigationService,
        private appConfigService: AppConfigService,
        private localStorageService: LocalStorageService,
        private apollo: Apollo,
    ) {
        super();

        this.trackSubscriptions(
            this.loginService.accessTokenChanges.subscribe((token: string) => this.saveAccessToken(token)),
            this.loginService.accountChanges.subscribe((user: AccountFragment) => this.changeUser(user)),
        );
    }

    public initializeCompletes(): Observable<void> {
        const loginInstructions: AppConfigLoginInstructions | null = this.appConfigService.loginInstructions;
        if (loginInstructions) {
            return this.loginService.genericLogin(
                loginInstructions.loginMethod,
                loginInstructions.loginCredentialsJson,
            );
        } else {
            return this.attemptPreviousAuthenticationCompletes();
        }
    }

    public get loggedInUserChanges(): Observable<MaybeNull<AccountFragment>> {
        return this.loggedInUser$.asObservable();
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

    private attemptPreviousAuthenticationCompletes(): Observable<void> {
        const accessToken: string | null = this.localStorageService.accessToken;
        if (typeof accessToken === "string" && !this.isAuthenticated) {
            return this.loginService.fetchAccountFromAccessToken(accessToken).pipe(
                first(),
                catchError(() => {
                    this.terminateSession();
                    return of();
                }),
            );
        } else {
            return of(void {});
        }
    }

    private changeUser(user: MaybeNull<AccountFragment>) {
        this.loggedInUser = user;
        this.loggedInUser$.next(user);
    }

    private clearGraphQLCache(): void {
        promiseWithCatch(this.apollo.client.clearStore());
    }

    private resetAccessToken(): void {
        this.localStorageService.setAccessToken(null);
    }

    private saveAccessToken(token: string): void {
        this.localStorageService.setAccessToken(token);
    }
}
