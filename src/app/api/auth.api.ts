import { Injectable } from "@angular/core";
import { catchError, first, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import {
    AccountFragment,
    FetchAccountDetailsGQL,
    FetchAccountDetailsMutation,
    GetEnabledLoginMethodsGQL,
    GetEnabledLoginMethodsQuery,
    LoginGQL,
    LoginMutation,
    LoginResponse,
} from "./kamu.graphql.interface";
import { MutationResult } from "apollo-angular";
import { AuthenticationError } from "../common/errors";
import { GithubLoginCredentials, PasswordLoginCredentials } from "./auth.api.model";
import { LoginMethod } from "../app-config.model";
import { ApolloQueryResult } from "@apollo/client";

@Injectable({
    providedIn: "root",
})
export class AuthApi {
    constructor(
        private getEnabledLoginMethodsGQL: GetEnabledLoginMethodsGQL,
        private loginGQL: LoginGQL,
        private fetchAccountDetailsGQL: FetchAccountDetailsGQL,
    ) {}

    public readEnabledLoginMethods(): Observable<LoginMethod[]> {
        return this.getEnabledLoginMethodsGQL.watch().valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<GetEnabledLoginMethodsQuery>) => {
                return result.data.auth.enabledLoginMethods as LoginMethod[];
            }),
        );
    }

    public fetchAccountAndTokenFromPasswordLogin(credentials: PasswordLoginCredentials): Observable<LoginResponse> {
        return this.fetchAccountAndTokenFromLoginMethod(LoginMethod.PASSWORD, JSON.stringify(credentials));
    }

    public fetchAccountAndTokenFromGithubCallbackCode(credentials: GithubLoginCredentials): Observable<LoginResponse> {
        return this.fetchAccountAndTokenFromLoginMethod(LoginMethod.GITHUB, JSON.stringify(credentials));
    }

    public fetchAccountAndTokenFromLoginMethod(
        loginMethod: string,
        loginCredentialsJson: string,
    ): Observable<LoginResponse> {
        return this.loginGQL.mutate({ login_method: loginMethod, login_credentials_json: loginCredentialsJson }).pipe(
            map((result: MutationResult<LoginMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data.auth.login;
                } else {
                    // Normally, this code should not be reachable
                    throw new AuthenticationError(result.errors ?? []);
                }
            }),
            catchError((e: Error) => throwError(() => new AuthenticationError([e]))),
        );
    }

    public fetchAccountFromAccessToken(accessToken: string): Observable<AccountFragment> {
        return this.fetchAccountDetailsGQL.mutate({ accessToken }).pipe(
            map((result: MutationResult<FetchAccountDetailsMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data.auth.accountDetails;
                } else {
                    // Normally, this code should not be reachable
                    throw new AuthenticationError(result.errors ?? []);
                }
            }),
            catchError((e: Error) => throwError(() => new AuthenticationError([e]))),
        );
    }
}
