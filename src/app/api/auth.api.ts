import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { NavigationService } from "../services/navigation.service";
import {
    AccountInfo,
    GithubLoginGQL,
    GithubLoginMutation,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";
import { FetchResult } from "apollo-link";
import { Optional } from "../common/app.types";

@Injectable()
export class AuthApi {
    constructor(
        private githubLoginGQL: GithubLoginGQL,
        private navigationService: NavigationService,
    ) {}

    public get onUserChanges(): Observable<Optional<AccountInfo>> {
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
    private user: Optional<AccountInfo>;
    private isAuthenticated: boolean;
    private userChanges$: Subject<Optional<AccountInfo>> = new Subject<
        Optional<AccountInfo>
    >();

    static handleError(error: Response): Observable<never> {
        return throwError(`GitHub ${error.statusText || "Server error"}`);
    }
    public userChange(user: Optional<AccountInfo>) {
        this.user = user;
        this.userChanges$.next(user);
    }

    public getUserInfoAndToken(code: string): Observable<void> {
        return this.getAccessToken(code).pipe(
            map(
                (accessToken: string) => {
                    localStorage.setItem(AppValues.localStorageCode, code);
                    localStorage.setItem(
                        AppValues.localStorageAccessToken,
                        accessToken,
                    );

                    this.isAuthUser = true;
                    // this.authApi.getUser(accessToken);
                },
                (err: Response) => {
                    this.isAuthUser = false;
                    localStorage.removeItem(AppValues.localStorageAccessToken);
                    AuthApi.handleError(err);
                },
            ),
        );
    }

    public getAccessToken(code: string): Observable<string> {
        return this.githubLoginGQL.mutate({ code }).pipe(
            map((result: FetchResult<GithubLoginMutation>) => {
                if (result.data) {
                    const login: GithubLoginMutation = result.data;
                    const accountInfo: AccountInfo =
                        login.auth.githubLogin.accountInfo;
                    this.userChange(accountInfo);
                    return login.auth.githubLogin.token.accessToken;
                } else {
                    throw new Error("GraphQL query failed");
                }
            }),
        );
    }

    public logOut(): void {
        this.userChange(null);
        localStorage.removeItem(AppValues.localStorageAccessToken);
        localStorage.removeItem(AppValues.localStorageCode);
        this.navigationService.navigateToHome();
    }
}
