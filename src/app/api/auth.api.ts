import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import {
    AccountDetailsFragment,
    FetchAccountInfoGQL,
    FetchAccountInfoMutation,
    GithubLoginGQL,
    GithubLoginMutation,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";

import { MaybeNull } from "../common/app.types";
import { MutationResult } from "apollo-angular";
import { isNull } from "lodash";
import { AuthenticationError } from "../common/errors";

@Injectable({
    providedIn: "root",
})
export class AuthApi {
    private user: MaybeNull<AccountDetailsFragment> = null;

    private userChanges$: Subject<MaybeNull<AccountDetailsFragment>> =
        new Subject<MaybeNull<AccountDetailsFragment>>();

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

    public fetchUserInfoAndTokenFromGithubCallackCode(
        code: string,
    ): Observable<void> {
        return this.githubLoginGQL.mutate({ code }).pipe(
            map((result: MutationResult<GithubLoginMutation>) => {
                if (result.data) {
                    const data: GithubLoginMutation = result.data;
                    localStorage.setItem(
                        AppValues.LOCAL_STORAGE_ACCESS_TOKEN,
                        data.auth.githubLogin.token.accessToken,
                    );
                    this.changeUser(data.auth.githubLogin.accountInfo);
                } else {
                    throw new AuthenticationError(result.errors ?? []);
                }
            }),
            catchError((e: Error) => throwError(new AuthenticationError([e]))),
        );
    }

    public fetchUserInfoFromAccessToken(accessToken: string): Observable<void> {
        return this.fetchAccountInfoGQL.mutate({ accessToken }).pipe(
            map((result: MutationResult<FetchAccountInfoMutation>) => {
                if (result.data) {
                    const data: FetchAccountInfoMutation = result.data;
                    this.changeUser(data.auth.accountInfo);
                } else {
                    throw new AuthenticationError(result.errors ?? []);
                }
            }),
            catchError((e: Error) => throwError(new AuthenticationError([e]))),
        );
    }

    public terminateSession() {
        this.changeUser(null);
        localStorage.removeItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
    }

    public logOut(): void {
        this.terminateSession();
        this.navigationService.navigateToHome();
    }
}
