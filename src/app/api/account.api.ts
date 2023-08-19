import { Observable, first, map } from "rxjs";

import { Injectable } from "@angular/core";
import { AccountByNameGQL, AccountByNameQuery, AccountFragment } from "./kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ApolloQueryResult } from "@apollo/client";

@Injectable({ providedIn: "root" })
export class AccountApi {
    constructor(private accountByNameGql: AccountByNameGQL) {}

    public fetchAccountByName(accountName: string): Observable<MaybeNull<AccountFragment>> {
        return this.accountByNameGql
            .watch({
                accountName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountByNameQuery>) => {
                    if (result.data.accounts.byName) {
                        return result.data.accounts.byName;
                    } else {
                        return null;
                    }
                }),
            );
    }
}
