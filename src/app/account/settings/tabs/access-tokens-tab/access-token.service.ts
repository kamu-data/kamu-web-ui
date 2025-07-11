/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../../../interface/app.types";
import { inject, Injectable } from "@angular/core";
import { AccessTokenApi } from "../../../../api/access-token.api";
import { Observable, map } from "rxjs";
import {
    AccessTokenConnection,
    CreateAccessTokenMutation,
    CreatedAccessToken,
    ListAccessTokensQuery,
    RevokeAccessTokenMutation,
} from "../../../../api/kamu.graphql.interface";
import { ToastrService } from "ngx-toastr";

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
    }): Observable<AccessTokenConnection> {
        return this.accessTokenApi
            .listAccessTokens(params)
            .pipe(
                map(
                    (result: ListAccessTokensQuery) =>
                        result.accounts.byId?.accessTokens.listAccessTokens as AccessTokenConnection,
                ),
            );
    }

    public createAccessTokens(accountId: string, tokenName: string): Observable<MaybeNull<CreatedAccessToken>> {
        return this.accessTokenApi.createAccessToken(accountId, tokenName).pipe(
            map((result: CreateAccessTokenMutation) => {
                const typename = result.accounts.byId?.accessTokens.createAccessToken.__typename;
                if (typename === "CreateAccessTokenResultSuccess") {
                    this.toastrService.success(result.accounts.byId?.accessTokens.createAccessToken.message);
                    return result.accounts.byId?.accessTokens.createAccessToken.token as CreatedAccessToken;
                } else {
                    this.toastrService.error(result.accounts.byId?.accessTokens.createAccessToken.message);
                    return null;
                }
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
