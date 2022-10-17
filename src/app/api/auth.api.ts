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

@Injectable()
export class AuthApi {
    private user: MaybeNull<AccountDetailsFragment>;
    private isAuthenticated: boolean;

    private userChanges$: Subject<MaybeNull<AccountDetailsFragment>> = new Subject<MaybeNull<AccountDetailsFragment>>();

    constructor(
        private githubLoginGQL: GithubLoginGQL,
        private fetchAccountInfoGQL: FetchAccountInfoGQL,
        private navigationService: NavigationService,
    ) {}

    public get onUserChanges(): Observable<MaybeNull<AccountDetailsFragment>> {
        return this.userChanges$.asObservable();
    }

    public get userModal() {
        return this.user;
    }

    public set isAuthUser(isAuthenticated: boolean) {
        this.isAuthenticated = isAuthenticated;
    }

    public get isAuthUser(): boolean {
        return this.isAuthenticated;
    }

    public userChange(user: MaybeNull<AccountDetailsFragment>) {
        this.user = user;
        this.userChanges$.next(user);
    }

    public fetchUserInfoAndTokenFromGithubCallackCode(code: string): Observable<void> {
        return this.githubLoginGQL.mutate({ code }).pipe(
            map((result: MutationResult<GithubLoginMutation>) => {
                if (result.data) {
                    this.isAuthUser = true;
                    const data: GithubLoginMutation = result.data;
                    localStorage.setItem(AppValues.localStorageAccessToken, data.auth.githubLogin.token.accessToken);
                    this.userChange(data.auth.githubLogin.accountInfo);
                } else {
                    this.handleAuthenticationError(result.errors);
                }
            },
            catchError(
                (e: Error) => this.handleAuthenticationError([e])
            )),
        );
    }

    public fetchUserInfoFromAccessToken(accessToken: string): Observable<void> {
        return this.fetchAccountInfoGQL.mutate({ accessToken }).pipe(
            map((result: MutationResult<FetchAccountInfoMutation>) => {
                if (result.data) {
                    this.isAuthUser = true;
                    const data: FetchAccountInfoMutation = result.data;
                    this.userChange(data.auth.accountInfo);
                } else {
                    this.handleAuthenticationError(result.errors);
                }
            },
            catchError(
                (e: Error) => this.handleAuthenticationError([e])
            )),
        );
    }

    private handleAuthenticationError(err: MaybeUndefined<readonly Error[]>): Observable<void> {
        if (err) {
            err.forEach((e: Error) => console.warn(`Authentication query error: ${e.message}`));
        } else {
            console.warn("Authentication query error");
        }
        this.isAuthUser = false;
        localStorage.removeItem(AppValues.localStorageAccessToken);
        this.userChange(null);
        return of(void 0);
    }

    public logOut(): void {
        this.userChange(null);
        localStorage.removeItem(AppValues.localStorageAccessToken);
        this.navigationService.navigateToHome();
    }
}
