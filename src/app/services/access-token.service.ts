import { MaybeNull } from "./../common/app.types";
import { inject, Injectable } from "@angular/core";
import { AccessTokenApi } from "../api/access-token.api";
import { Observable, map } from "rxjs";
import {
    AccessTokenConnection,
    CreateAccessTokenMutation,
    CreatedAccessToken,
    ListAccessTokensQuery,
    RevokeAccessTokenMutation,
} from "../api/kamu.graphql.interface";
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
            .pipe(map((result: ListAccessTokensQuery) => result.auth.listAccessTokens as AccessTokenConnection));
    }

    public createAccessTokens(accountId: string, tokenName: string): Observable<MaybeNull<CreatedAccessToken>> {
        return this.accessTokenApi.createAccessToken(accountId, tokenName).pipe(
            map((result: CreateAccessTokenMutation) => {
                const typename = result.auth.createAccessToken.__typename;
                if (typename === "CreateAccessTokenResultSuccess") {
                    this.toastrService.success(result.auth.createAccessToken.message);
                    return result.auth.createAccessToken.token;
                } else {
                    this.toastrService.error(result.auth.createAccessToken.message);
                    return null;
                }
            }),
        );
    }

    public revokeAccessTokens(revokeId: string): Observable<void> {
        return this.accessTokenApi.revokeAccessToken(revokeId).pipe(
            map((result: RevokeAccessTokenMutation) => {
                const typename = result.auth.revokeAccessToken.__typename;
                if (typename === "RevokeResultSuccess") {
                    this.toastrService.success(result.auth.revokeAccessToken.message);
                } else {
                    this.toastrService.error(result.auth.revokeAccessToken.message);
                }
            }),
        );
    }
}
