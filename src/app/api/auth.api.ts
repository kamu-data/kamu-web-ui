import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { UserInterface } from "../interface/auth.interface";
import { NavigationService } from "../services/navigation.service";
import {
    AccountInfo,
    GithubLoginGQL,
    GithubLoginMutation,
} from "./kamu.graphql.interface";
import AppValues from "../common/app.values";
import { FetchResult } from "apollo-link";

@Injectable()
export class AuthApi {
    constructor(
        private githubLoginGQL: GithubLoginGQL,
        private navigationService: NavigationService,
    ) {}

    public get onUserChanges(): Observable<UserInterface | {}> {
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
    private user: UserInterface | {};
    private isAuthenticated: boolean;
    private userChanges$: Subject<UserInterface | {}> = new Subject<
        UserInterface | {}
    >();

    static handleError(error: Response): Observable<never> {
        return throwError(`GitHub ${error.statusText || "Server error"}`);
    }
    public userChange(user: UserInterface | {}) {
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
                (err: any) => {
                    this.isAuthUser = false;
                    localStorage.removeItem(AppValues.localStorageAccessToken);
                    AuthApi.handleError(err);
                },
            ),
        );
    }

    public getAccessToken(code: string): Observable<string> {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        // @ts-ignore
        return this.githubLoginGQL.mutate({ code: code }).pipe(
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

    public getUser(token: string = ""): void {
        const localStorageAccessToken: string | null = localStorage.getItem(
            AppValues.localStorageAccessToken,
        );
        const accessToken: string =
            token === "" && localStorageAccessToken
                ? localStorageAccessToken
                : token;

        //   this.getUserRequest(accessToken).subscribe((user: UserInterface) => {
        //       debugger
        //       this.userChange(user);
        //       localStorage.setItem('access_token', accessToken);
        //       this.router.navigate(['/']);
        // });
    }

    public logOut(): void {
        this.userChange({});
        localStorage.removeItem(AppValues.localStorageAccessToken);
        localStorage.removeItem(AppValues.localStorageCode);
        this.navigationService.navigateToHome();
    }
}
