import { Observable, first, map } from "rxjs";
import { Injectable } from "@angular/core";
import {
    AccountByNameGQL,
    AccountByNameQuery,
    AccountDatasetFlowsPausedGQL,
    AccountDatasetFlowsPausedQuery,
    AccountFlowFilters,
    AccountFragment,
    AccountListDatasetsWithFlowsGQL,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsGQL,
    AccountListFlowsQuery,
    AccountPauseFlowsGQL,
    AccountPauseFlowsMutation,
    AccountResumeFlowsGQL,
    AccountResumeFlowsMutation,
} from "./kamu.graphql.interface";
import { MaybeNull } from "../common/app.types";
import { ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/data.helpers";
import { DatasetOperationError } from "../common/errors";

@Injectable({ providedIn: "root" })
export class AccountApi {
    constructor(
        private accountByNameGql: AccountByNameGQL,
        private accountListFlowsGql: AccountListFlowsGQL,
        private accountListDatasetsWithFlowsGql: AccountListDatasetsWithFlowsGQL,
        private accountDatasetFlowsPausedGql: AccountDatasetFlowsPausedGQL,
        private accountPauseFlowsGql: AccountPauseFlowsGQL,
        private accountResumeFlowsGql: AccountResumeFlowsGQL,
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
        return this.accountListFlowsGql
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

    public accountDatasetsWithFlows(accountName: string): Observable<AccountListDatasetsWithFlowsQuery> {
        return this.accountListDatasetsWithFlowsGql
            .watch(
                { name: accountName },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<AccountListDatasetsWithFlowsQuery>) => {
                    return result.data;
                }),
            );
    }

    public accountFlowsPaused(accountName: string): Observable<AccountDatasetFlowsPausedQuery> {
        return this.accountDatasetFlowsPausedGql.watch({ accountName }, noCacheFetchPolicy).valueChanges.pipe(
            map((result: ApolloQueryResult<AccountDatasetFlowsPausedQuery>) => {
                return result.data;
            }),
        );
    }

    public accountPauseFlows(accountName: string): Observable<AccountPauseFlowsMutation> {
        return this.accountPauseFlowsGql
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<AccountPauseFlowsMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public accountResumeFlows(accountName: string): Observable<AccountResumeFlowsMutation> {
        return this.accountResumeFlowsGql
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<AccountResumeFlowsMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }
}
