/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable } from "rxjs";

import { ToastrService } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { FieldMutationResult } from "@common/validation/server-errors.helpers";
import { AccessTokenApi } from "@api/access-token.api";
import {
    AccessTokenConnectionDataFragment,
    CreateAccessTokenMutation,
    CreatedAccessTokenDataFragment,
    ListAccessTokensQuery,
    RevokeAccessTokenMutation,
} from "@api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class AccessTokenService {
    private accessTokenApi = inject(AccessTokenApi);
    private toastrService = inject(ToastrService);

    public listAccessTokens(params: {
        accountId: string;
        page: number;
        perPage: number;
    }): Observable<AccessTokenConnectionDataFragment> {
        return this.accessTokenApi
            .listAccessTokens(params)
            .pipe(
                map(
                    (result: ListAccessTokensQuery) =>
                        requireValue(result.accounts.byId, "Account not found").accessTokens.listAccessTokens,
                ),
            );
    }

    public createAccessTokens(
        accountId: string,
        tokenName: string,
    ): Observable<FieldMutationResult<CreatedAccessTokenDataFragment>> {
        return this.accessTokenApi.createAccessToken(accountId, tokenName).pipe(
            map((result: CreateAccessTokenMutation): FieldMutationResult<CreatedAccessTokenDataFragment> => {
                const createResult = requireValue(result.accounts.byId, "Account not found").accessTokens
                    .createAccessToken;
                if (createResult.__typename === "CreateAccessTokenResultSuccess") {
                    this.toastrService.success(createResult.message);
                    return { ok: true, value: createResult.token };
                }
                return { ok: false, fieldError: createResult.message };
            }),
        );
    }

    public revokeAccessTokens(accountId: string, revokeId: string): Observable<void> {
        return this.accessTokenApi.revokeAccessToken(accountId, revokeId).pipe(
            map((result: RevokeAccessTokenMutation) => {
                const typename = result.accounts.byId?.accessTokens.revokeAccessToken.__typename;
                if (typename === "RevokeResultSuccess") {
                    this.toastrService.success(result.accounts.byId?.accessTokens.revokeAccessToken.message);
                } else {
                    this.toastrService.error(result.accounts.byId?.accessTokens.revokeAccessToken.message);
                }
            }),
        );
    }
}
