/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EMPTY, Observable, catchError, first, map } from "rxjs";
import { inject, Injectable } from "@angular/core";
import {
    AccountByNameGQL,
    AccountByNameQuery,
    AccountChangeEmailGQL,
    AccountChangeEmailMutation,
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
    AccountWithEmailGQL,
    AccountWithEmailQuery,
    ChangeAccountUsernameGQL,
    ChangeAccountUsernameMutation,
    DeleteAccountByNameGQL,
    DeleteAccountByNameMutation,
    ChangeUserPasswordGQL,
    ChangeAdminPasswordGQL,
    ChangeUserPasswordMutation,
    ChangeAdminPasswordMutation,
    FlowProcessFilters,
    FlowProcessOrdering,
    AccountFlowsAsCardsGQL,
    AccountFlowsAsCardsQuery,
} from "./kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";

@Injectable({ providedIn: "root" })
export class AccountApi {
    private accountByNameGql = inject(AccountByNameGQL);
    private accountListFlowsGql = inject(AccountListFlowsGQL);
    private accountListDatasetsWithFlowsGql = inject(AccountListDatasetsWithFlowsGQL);
    private accountDatasetFlowsPausedGql = inject(AccountDatasetFlowsPausedGQL);
    private accountPauseFlowsGql = inject(AccountPauseFlowsGQL);
    private accountResumeFlowsGql = inject(AccountResumeFlowsGQL);
    private accountWithEmailGql = inject(AccountWithEmailGQL);
    private accountChangeEmailGQL = inject(AccountChangeEmailGQL);
    private deleteAccountByNameGQL = inject(DeleteAccountByNameGQL);
    private changeAccountUsernameGQL = inject(ChangeAccountUsernameGQL);
    private changeAdminPasswordGQL = inject(ChangeAdminPasswordGQL);
    private changeUserPasswordGQL = inject(ChangeUserPasswordGQL);
    private accountFlowsAsCardsGQL = inject(AccountFlowsAsCardsGQL);

    public changeAccountUsername(params: {
        accountName: string;
        newName: string;
    }): Observable<ChangeAccountUsernameMutation> {
        return this.changeAccountUsernameGQL.mutate({ accountName: params.accountName, newName: params.newName }).pipe(
            first(),
            map((result: MutationResult<ChangeAccountUsernameMutation>) => {
                return result.data as ChangeAccountUsernameMutation;
            }),
        );
    }

    public changeAccountEmail(params: {
        accountName: string;
        newEmail: string;
    }): Observable<AccountChangeEmailMutation> {
        return this.accountChangeEmailGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<AccountChangeEmailMutation>) => {
                return result.data as AccountChangeEmailMutation;
            }),
        );
    }

    public changeAdminPassword(params: {
        accountName: string;
        password: string;
    }): Observable<ChangeAdminPasswordMutation> {
        return this.changeAdminPasswordGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<ChangeAdminPasswordMutation>) => {
                return result.data as ChangeAdminPasswordMutation;
            }),
        );
    }

    public changeUserPassword(params: {
        accountName: string;
        oldPassword: string;
        newPassword: string;
    }): Observable<ChangeUserPasswordMutation> {
        return this.changeUserPasswordGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<ChangeUserPasswordMutation>) => {
                return result.data as ChangeUserPasswordMutation;
            }),
            catchError(() => EMPTY),
        );
    }

    public fetchAccountWithEmail(accountName: string): Observable<AccountWithEmailQuery> {
        return this.accountWithEmailGql
            .watch(
                {
                    accountName,
                },
                noCacheFetchPolicy,
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountWithEmailQuery>) => {
                    return result.data;
                }),
            );
    }

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
        accountName: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: AccountFlowFilters;
    }): Observable<AccountListFlowsQuery> {
        return this.accountListFlowsGql
            .watch(
                {
                    name: params.accountName,
                    page: params.page,
                    perPageTable: params.perPageTable,
                    perPageTiles: params.perPageTiles,
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

    public fetchAccountFlowsAsCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<AccountFlowsAsCardsQuery> {
        return this.accountFlowsAsCardsGQL
            .watch(
                {
                    name: params.accountName,
                    page: params.page,
                    perPage: params.perPage,
                    filters: params.filters,
                    ordering: params.ordering,
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
                map((result: ApolloQueryResult<AccountFlowsAsCardsQuery>) => {
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
                    return result.data as AccountPauseFlowsMutation;
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
                    return result.data as AccountResumeFlowsMutation;
                }),
            );
    }

    public deleteAccountByName(accountName: string): Observable<DeleteAccountByNameMutation> {
        return this.deleteAccountByNameGQL
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<DeleteAccountByNameMutation>) => {
                    return result.data as DeleteAccountByNameMutation;
                }),
            );
    }
}
