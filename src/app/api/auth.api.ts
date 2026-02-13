/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { catchError, first, map } from "rxjs/operators";
import { onlyCompleteData } from "apollo-angular";
import { Observable, of } from "rxjs";
import {
    AccountFragment,
    AccountProvider,
    FetchAccountDetailsGQL,
    FetchAccountDetailsMutation,
    GetEnabledLoginMethodsGQL,
    GetEnabledLoginMethodsQuery,
    LoginGQL,
    LoginMutation,
    LoginWeb3WalletGQL,
    LoginWeb3WalletMutation,
} from "./kamu.graphql.interface";
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import {
    GithubLoginCredentials,
    LoginResponseType,
    PasswordLoginCredentials,
    Web3WalletOwnershipVerificationRequest,
} from "./auth.api.model";

@Injectable({
    providedIn: "root",
})
export class AuthApi {
    private getEnabledLoginMethodsGQL = inject(GetEnabledLoginMethodsGQL);
    private loginGQL = inject(LoginGQL);
    private fetchAccountDetailsGQL = inject(FetchAccountDetailsGQL);
    private loginWeb3WalletGQL = inject(LoginWeb3WalletGQL);

    public readEnabledLoginMethods(): Observable<AccountProvider[]> {
        return this.getEnabledLoginMethodsGQL.watch().valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<GetEnabledLoginMethodsQuery>) => {
                return result.data?.auth?.enabledProviders ?? [];
            }),
            catchError(() => {
                return of([]);
            }),
        );
    }

    public fetchAccountAndTokenFromPasswordLogin(
        credentials: PasswordLoginCredentials,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.fetchAccountAndTokenFromLoginMethod(
            AccountProvider.Password,
            JSON.stringify(credentials),
            deviceCode,
        );
    }

    public fetchAccountAndTokenFromGithubCallbackCode(
        credentials: GithubLoginCredentials,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.fetchAccountAndTokenFromLoginMethod(
            AccountProvider.OauthGithub,
            JSON.stringify(credentials),
            deviceCode,
        );
    }

    public fetchAccountAndTokenFromWeb3Wallet(
        credentials: Web3WalletOwnershipVerificationRequest,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.fetchAccountAndTokenFromLoginMethod(
            AccountProvider.Web3Wallet,
            JSON.stringify(credentials),
            deviceCode,
        );
    }

    public fetchAccountAndTokenFromLoginMethod(
        loginMethod: AccountProvider,
        loginCredentialsJson: string,
        deviceCode?: string,
    ): Observable<LoginResponseType> {
        return this.loginGQL
            .mutate({
                variables: { login_method: loginMethod, login_credentials_json: loginCredentialsJson, deviceCode },
                update: (cache) => {
                    const cacheMap = cache.extract() as object[];
                    const datasetCachedKeys = Object.keys(cacheMap).filter((item: string) => item.includes("Dataset:"));
                    datasetCachedKeys.forEach((key) => {
                        cache.evict({
                            id: key,
                            fieldName: "permissions",
                        });
                    });
                },
            })
            .pipe(
                map((result: ApolloLink.Result<LoginMutation>) => {
                    return result.data?.auth.login as LoginResponseType;
                }),
            );
    }

    public fetchAccountFromAccessToken(accessToken: string): Observable<AccountFragment> {
        return this.fetchAccountDetailsGQL.mutate({ variables: { accessToken } }).pipe(
            map((result: ApolloLink.Result<FetchAccountDetailsMutation>) => {
                return result.data?.auth.accountDetails as AccountFragment;
            }),
        );
    }

    public fetchAuthNonceFromWeb3Wallet(walletAddress: string): Observable<string> {
        return this.loginWeb3WalletGQL.mutate({ variables: { account: walletAddress } }).pipe(
            map((result: ApolloLink.Result<LoginWeb3WalletMutation>) => {
                return result.data?.auth.web3.eip4361AuthNonce.value as string;
            }),
        );
    }
}
