import { Observable, first, map } from "rxjs";
import { Injectable } from "@angular/core";
import {
    AccountByNameGQL,
    AccountByNameQuery,
    AccountFlowFilters,
    AccountFragment,
    AccountListDatasetsWithFlowsGQL,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsGQL,
    AccountListFlowsQuery,
} from "./kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ApolloQueryResult } from "@apollo/client";
import { noCacheFetchPolicy } from "../common/data.helpers";

@Injectable({ providedIn: "root" })
export class AccountApi {
    constructor(
        private accountByNameGql: AccountByNameGQL,
        private accountListFlowsGQL: AccountListFlowsGQL,
        private accountListDatasetsWithFlows: AccountListDatasetsWithFlowsGQL,
    ) {}

    public fetchAccountByName(accountName: string): Observable<MaybeNull<AccountFragment>> {
        return this.accountByNameGql
            .watch({
                accountName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountByNameQuery>) => {
                    return result.data.accounts.byName ?? null;
                }),
            );
    }

    public fetchAccountListFlows(params: {
        accounName: string;
        page: number;
        perPage: number;
        filters: AccountFlowFilters;
    }): Observable<AccountListFlowsQuery> {
        return this.accountListFlowsGQL
            .watch(
                {
                    name: params.accounName,
                    page: params.page,
                    perPage: params.perPage,
                    filters: params.filters,
                },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountListFlowsQuery>) => {
                    return result.data;
                }),
            );
    }

    public accountDatasetsWithFlows(accounName: string): Observable<AccountListDatasetsWithFlowsQuery> {
        return this.accountListDatasetsWithFlows.watch({ name: accounName }, noCacheFetchPolicy).valueChanges.pipe(
            map((result: ApolloQueryResult<AccountListDatasetsWithFlowsQuery>) => {
                return result.data;
            }),
        );
    }
}
