/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable, catchError, first, map } from "rxjs";
import {
    CreateAccessTokenGQL,
    CreateAccessTokenMutation,
    ListAccessTokensGQL,
    ListAccessTokensQuery,
    RevokeAccessTokenGQL,
    RevokeAccessTokenMutation,
} from "./kamu.graphql.interface";
import { ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";

@Injectable({
    providedIn: "root",
})
export class AccessTokenApi {
    private listAccessTokensGQL = inject(ListAccessTokensGQL);
    private createAccessTokenGQL = inject(CreateAccessTokenGQL);
    private revokeAccessTokenGQL = inject(RevokeAccessTokenGQL);

    public listAccessTokens(params: {
        accountId: string;
        page: number;
        perPage: number;
    }): Observable<ListAccessTokensQuery> {
        return this.listAccessTokensGQL
            .watch(
                { accountId: params.accountId, page: params.page, perPage: params.perPage },
                {
                    ...noCacheFetchPolicy,
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<ListAccessTokensQuery>) => {
                    return result.data;
                }),
            );
    }

    public createAccessToken(accountId: string, tokenName: string): Observable<CreateAccessTokenMutation> {
        return this.createAccessTokenGQL.mutate({ accountId, tokenName }).pipe(
            first(),
            map((result: MutationResult<CreateAccessTokenMutation>) => {
                return result.data as CreateAccessTokenMutation;
            }),
            catchError(() => EMPTY),
        );
    }

    public revokeAccessToken(tokenId: string): Observable<RevokeAccessTokenMutation> {
        return this.revokeAccessTokenGQL.mutate({ tokenId }).pipe(
            first(),
            map((result: MutationResult<RevokeAccessTokenMutation>) => {
                return result.data as RevokeAccessTokenMutation;
            }),
            catchError(() => EMPTY),
        );
    }
}
