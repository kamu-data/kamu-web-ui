import { inject, Injectable } from "@angular/core";
import { AccountApi } from "../api/account.api";

@Injectable({
    providedIn: "root",
})
export class AccountEmailService {
    private accountApi = inject(AccountApi);

    public changeEmailAddress(params: { accountName: string; currentEmailAddress: string }): void {}
}
