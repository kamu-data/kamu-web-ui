/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, Subject } from "rxjs";

import { ToastrService } from "ngx-toastr";

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

    private renameAccountEmailError$: Subject<string> = new Subject<string>();

    public emitRenameAccountEmailErrorOccurred(message: string): void {
        this.renameAccountEmailError$.next(message);
    }

    public get renameAccountEmailErrorOccurrences(): Observable<string> {
        return this.renameAccountEmailError$.asObservable();
    }

    public resetChangeEmailError(): void {
        this.emitRenameAccountEmailErrorOccurred("");
    }

    public fetchAccountWithEmail(accountName: string): Observable<MaybeNull<AccountWithEmailFragment>> {
        return this.accountApi.fetchAccountWithEmail(accountName).pipe(
            map((data: AccountWithEmailQuery) => {
                return data.accounts.byName ?? null;
            }),
        );
    }

    public changeEmailAddress(params: { accountName: string; newEmail: string }): Observable<boolean> {
        return this.accountApi.changeAccountEmail(params).pipe(
            map((data: AccountChangeEmailMutation) => {
                const updateEmail = data.accounts.byName?.updateEmail;
                if (updateEmail?.__typename === "UpdateEmailSuccess") {
                    this.toastrService.success(updateEmail.message);
                    return true;
                } else {
                    this.emitRenameAccountEmailErrorOccurred(updateEmail?.message ?? "");
                    return false;
                }
            }),
        );
    }
}
