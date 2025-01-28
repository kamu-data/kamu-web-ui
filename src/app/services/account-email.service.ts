import { inject, Injectable } from "@angular/core";
import { AccountApi } from "../api/account.api";
import { map, Observable } from "rxjs";
import { AccountWithEmailFragment, AccountWithEmailQuery } from "../api/kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class AccountEmailService {
    private accountApi = inject(AccountApi);
    private toastrService = inject(ToastrService);

    public fetchAccountWithEmail(accountName: string): Observable<MaybeNull<AccountWithEmailFragment>> {
        return this.accountApi.fetchAccountWithEmail(accountName).pipe(
            map((data: MaybeNull<AccountWithEmailQuery>) => {
                if (data) {
                    return data.accounts.byName as AccountWithEmailFragment;
                } else {
                    this.toastrService.error("Account not found");
                    return null;
                }
            }),
        );
    }

    public changeEmailAddress(params: { accountName: string; currentEmailAddress: string }): void {}
}
