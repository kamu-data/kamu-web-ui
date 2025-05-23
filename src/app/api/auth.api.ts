/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
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
} from "./kamu.graphql.interface";
import { MutationResult } from "apollo-angular";
import { GithubLoginCredentials, LoginResponseType, PasswordLoginCredentials } from "./auth.api.model";
import { LoginMethod } from "../app-config.model";
import { ApolloQueryResult } from "@apollo/client";
import { AuthenticationError } from "../common/values/errors";

@Injectable({
    providedIn: "root",
})
export class AuthApi {
    private getEnabledLoginMethodsGQL = inject(GetEnabledLoginMethodsGQL);
    private loginGQL = inject(LoginGQL);
    private fetchAccountDetailsGQL = inject(FetchAccountDetailsGQL);

    public readEnabledLoginMethods(): Observable<LoginMethod[]> {
        return this.getEnabledLoginMethodsGQL.watch().valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<GetEnabledLoginMethodsQuery>) => {
                return result.data.auth.enabledLoginMethods as LoginMethod[];
            }),
        );
    }

    public fetchAccountAndTokenFromPasswordLogin(
        credentials: PasswordLoginCredentials,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.fetchAccountAndTokenFromLoginMethod(LoginMethod.PASSWORD, JSON.stringify(credentials), deviceCode);
    }

    public fetchAccountAndTokenFromGithubCallbackCode(
        credentials: GithubLoginCredentials,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.fetchAccountAndTokenFromLoginMethod(LoginMethod.GITHUB, JSON.stringify(credentials), deviceCode);
    }

    public fetchAccountAndTokenFromLoginMethod(
        loginMethod: string,
        loginCredentialsJson: string,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.loginGQL
            .mutate(
                { login_method: loginMethod, login_credentials_json: loginCredentialsJson, deviceCode },
                {
                    update: (cache) => {
                        const cacheMap = cache.extract() as object[];
                        const datasetCachedKeys = Object.keys(cacheMap).filter((item: string) =>
                            item.includes("Dataset:"),
                        );
                        datasetCachedKeys.forEach((key) => {
                            cache.evict({
                                id: key,
                                fieldName: "permissions",
                            });
                        });
                    },
                },
            )
            .pipe(
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
