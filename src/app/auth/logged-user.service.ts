import { Injectable } from "@angular/core";
import { catchError, first } from "rxjs/operators";
import { EMPTY, Observable, ReplaySubject, Subject } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import { MaybeNull } from "../interface/app.types";
import { AppConfigService } from "../app-config.service";
import { AccountFragment } from "../api/kamu.graphql.interface";
import { UnsubscribeDestroyRefAdapter } from "../common/components/unsubscribe.ondestroy.adapter";
import { AppLoginInstructions } from "../app-config.model";
import { Apollo } from "apollo-angular";
import { isNull, promiseWithCatch } from "../common/helpers/app.helpers";
import { LoginService } from "./login/login.service";
import { LocalStorageService } from "../services/local-storage.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: "root",
})
export class LoggedUserService extends UnsubscribeDestroyRefAdapter {
    private loggedInUser: MaybeNull<AccountFragment> = null;
    private loggedInUser$: Subject<MaybeNull<AccountFragment>> = new ReplaySubject<MaybeNull<AccountFragment>>(1);

    public constructor(
        private loginService: LoginService,
        private navigationService: NavigationService,
        private appConfigService: AppConfigService,
        private localStorageService: LocalStorageService,
        private apollo: Apollo,
    ) {
        super();

        this.loginService.accessTokenChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((token: string) => this.saveAccessToken(token)),
            this.loginService.accountChanges
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((user: AccountFragment) => this.changeUser(user));
    }

    public initializeCompletes(): Observable<void> {
        const loginInstructions: AppLoginInstructions | null = this.appConfigService.loginInstructions;
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

    public get maybeCurrentlyLoggedInUser(): MaybeNull<AccountFragment> {
        return this.loggedInUser;
    }

    public get currentlyLoggedInUser(): AccountFragment {
        if (this.loggedInUser) {
            return this.loggedInUser;
        } else {
            throw new Error("No currently logged in user");
        }
    }

    public get isAuthenticated(): boolean {
        return !isNull(this.loggedInUser);
    }

    public get isAdmin(): boolean {
        return this.maybeCurrentlyLoggedInUser?.isAdmin ?? false;
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
                    return EMPTY;
                }),
            );
        } else {
            return EMPTY;
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
