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
import { AccountApi } from "@api/account.api";
import {
    AccountChangeEmailMutation,
    AccountWithEmailFragment,
    AccountWithEmailQuery,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Injectable({
    providedIn: "root",
})
export class AccountEmailService {
    private accountApi = inject(AccountApi);
    private toastrService = inject(ToastrService);

    public fetchAccountWithEmail(accountName: string): Observable<MaybeNull<AccountWithEmailFragment>> {
        return this.accountApi.fetchAccountWithEmail(accountName).pipe(
            map((data: AccountWithEmailQuery) => {
                return data.accounts.byName ?? null;
            }),
        );
    }

    public changeEmailAddress(params: {
        accountName: string;
        newEmail: string;
    }): Observable<FieldMutationResult<true>> {
        return this.accountApi.changeAccountEmail(params).pipe(
            map((data: AccountChangeEmailMutation): FieldMutationResult<true> => {
                const updateEmail = requireValue(data.accounts.byName, "Account not found").updateEmail;
                if (updateEmail.__typename === "UpdateEmailSuccess") {
                    this.toastrService.success(updateEmail.message);
                    return { ok: true, value: true };
                }
                return { ok: false, fieldError: updateEmail.message };
            }),
        );
    }
}
