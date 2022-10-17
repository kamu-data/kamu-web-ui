import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import {
    AccountDetailsFragment,
    FetchAccountInfoGQL,
    FetchAccountInfoMutation,
    GithubLoginGQL,
    GithubLoginMutation,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";

import { MaybeNull, MaybeUndefined } from "../common/app.types";
import { MutationResult } from 'apollo-angular';
import { isNull } from "lodash";
import { logError } from "../common/app.helpers";

@Injectable()
export class AuthApi {
    private user: MaybeNull<AccountDetailsFragment> = null;

    private userChanges$: Subject<MaybeNull<AccountDetailsFragment>> = new Subject<MaybeNull<AccountDetailsFragment>>();

    constructor(
        private githubLoginGQL: GithubLoginGQL,
        private fetchAccountInfoGQL: FetchAccountInfoGQL,
        private navigationService: NavigationService,
    ) {}

    public get onUserChanges(): Observable<MaybeNull<AccountDetailsFragment>> {
        return this.userChanges$.asObservable();
    }

    public get currentUser(): MaybeNull<AccountDetailsFragment> {
        return this.user;
    }

    public get isAuthenticated(): boolean {
        return !isNull(this.user);
    }

    private changeUser(user: MaybeNull<AccountDetailsFragment>) {
        this.user = user;
        this.userChanges$.next(user);
    }

    public fetchUserInfoAndTokenFromGithubCallackCode(code: string): Observable<void> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.githubLoginGQL.mutate({ code }).pipe(
            map((result: MutationResult<GithubLoginMutation>) => {
                if (result.data) {
                    const data: GithubLoginMutation = result.data;
                    localStorage.setItem(AppValues.localStorageAccessToken, data.auth.githubLogin.token.accessToken);
                    this.changeUser(data.auth.githubLogin.accountInfo);
                } else {
                    this.handleAuthenticationError(result.errors);
                }
            }),
            catchError(
                (e: Error) => {
                    return this.handleAuthenticationError([e]);
                }
            ),            
        );
    }

    public fetchUserInfoFromAccessToken(accessToken: string): Observable<void> {
        return this.fetchAccountInfoGQL.mutate({ accessToken }).pipe(
            map((result: MutationResult<FetchAccountInfoMutation>) => {
                if (result.data) {
                    const data: FetchAccountInfoMutation = result.data;
                    this.changeUser(data.auth.accountInfo);
                } else {
                    this.handleAuthenticationError(result.errors);
                }
            }),
            catchError(
                (e: Error) => this.handleAuthenticationError([e])
            ),
        );
    }

    private handleAuthenticationError(err: MaybeUndefined<readonly Error[]>): Observable<void> {     
        if (err) {
            err.forEach((e: Error) => logError(`Authentication query error: ${e.message}`));
        } else {
            logError("Uknown authentication query error");
        }
        localStorage.removeItem(AppValues.localStorageAccessToken);
        this.changeUser(null);
        return of();
    }

    public logOut(): void {
        this.changeUser(null);
        localStorage.removeItem(AppValues.localStorageAccessToken);
        this.navigationService.navigateToHome();
    }
}
