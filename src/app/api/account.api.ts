import { mockAccountDetails } from "./mock/auth.mock";
import { Observable, of } from "rxjs";

import { Injectable } from "@angular/core";
import { AccountDetailsFragment } from "./kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class AccountApi {
    public getAccountInfoByName(
        name: string,
    ): Observable<AccountDetailsFragment> {
        return of({ ...mockAccountDetails, login: name });
    }
}
