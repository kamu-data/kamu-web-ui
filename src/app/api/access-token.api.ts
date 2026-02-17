/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { first, map, Observable } from "rxjs";

import {
    CreateAccessTokenGQL,
    CreateAccessTokenMutation,
    ListAccessTokensGQL,
    ListAccessTokensQuery,
    RevokeAccessTokenGQL,
    RevokeAccessTokenMutation,
} from "@api/kamu.graphql.interface";
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import { onlyCompleteData } from "apollo-angular";

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
            .watch({
                variables: { accountId: params.accountId, page: params.page, perPage: params.perPage },
                ...noCacheFetchPolicy,
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<ListAccessTokensQuery>) => {
                    return result.data as ListAccessTokensQuery;
                }),
            );
    }

    public createAccessToken(accountId: string, tokenName: string): Observable<CreateAccessTokenMutation> {
        return this.createAccessTokenGQL.mutate({ variables: { accountId, tokenName } }).pipe(
            first(),
            map((result: ApolloLink.Result<CreateAccessTokenMutation>) => {
                return result.data as CreateAccessTokenMutation;
            }),
        );
    }

    public revokeAccessToken(accountId: string, tokenId: string): Observable<RevokeAccessTokenMutation> {
        return this.revokeAccessTokenGQL.mutate({ variables: { accountId, tokenId } }).pipe(
            first(),
            map((result: ApolloLink.Result<RevokeAccessTokenMutation>) => {
                return result.data as RevokeAccessTokenMutation;
            }),
        );
    }
}
