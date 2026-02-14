/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EMPTY, Observable, catchError, first, map } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { onlyCompleteData } from "apollo-angular";
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
    AccountPrimaryCardsGQL,
    AccountPrimaryCardsQuery,
    AccountWebhookCardsGQL,
    AccountWebhookCardsQuery,
} from "./kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { ApolloLink, ObservableQuery } from "@apollo/client/core";
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
    private accountPrimaryCardsGQL = inject(AccountPrimaryCardsGQL);
    private accountWebhookCardsGQL = inject(AccountWebhookCardsGQL);

    public changeAccountUsername(params: {
        accountName: string;
        newName: string;
    }): Observable<ChangeAccountUsernameMutation> {
        return this.changeAccountUsernameGQL
            .mutate({ variables: { accountName: params.accountName, newName: params.newName } })
            .pipe(
                first(),
                map((result: ApolloLink.Result<ChangeAccountUsernameMutation>) => {
                    return result.data as ChangeAccountUsernameMutation;
                }),
            );
    }

    public changeAccountEmail(params: {
        accountName: string;
        newEmail: string;
    }): Observable<AccountChangeEmailMutation> {
        return this.accountChangeEmailGQL.mutate({ variables: params }).pipe(
            first(),
            map((result: ApolloLink.Result<AccountChangeEmailMutation>) => {
                return result.data as AccountChangeEmailMutation;
            }),
        );
    }

    public changeAdminPassword(params: {
        accountName: string;
        password: string;
    }): Observable<ChangeAdminPasswordMutation> {
        return this.changeAdminPasswordGQL.mutate({ variables: params }).pipe(
            first(),
            map((result: ApolloLink.Result<ChangeAdminPasswordMutation>) => {
                return result.data as ChangeAdminPasswordMutation;
            }),
        );
    }

    public changeUserPassword(params: {
        accountName: string;
        oldPassword: string;
        newPassword: string;
    }): Observable<ChangeUserPasswordMutation> {
        return this.changeUserPasswordGQL.mutate({ variables: params }).pipe(
            first(),
            map((result: ApolloLink.Result<ChangeUserPasswordMutation>) => {
                return result.data as ChangeUserPasswordMutation;
            }),
            catchError(() => EMPTY),
        );
    }

    public fetchAccountWithEmail(accountName: string): Observable<AccountWithEmailQuery> {
        return this.accountWithEmailGql
            .watch({
                variables: {
                    accountName,
                },
                ...noCacheFetchPolicy,
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountWithEmailQuery>) => {
                    return result.data as AccountWithEmailQuery;
                }),
            );
    }

    public fetchAccountByName(accountName: string): Observable<MaybeNull<AccountFragment>> {
        return this.accountByNameGql
            .watch({
                variables: {
                    accountName,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountByNameQuery>) => {
                    return (result.data?.accounts?.byName ?? null) as MaybeNull<AccountFragment>;
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
            .watch({
                variables: {
                    name: params.accountName,
                    page: params.page,
                    perPageTable: params.perPageTable,
                    perPageTiles: params.perPageTiles,
                    filters: params.filters,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountListFlowsQuery>) => {
                    return result.data as AccountListFlowsQuery;
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
            .watch({
                variables: {
                    name: params.accountName,
                    page: params.page,
                    perPage: params.perPage,
                    filters: params.filters,
                    ordering: params.ordering,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountFlowsAsCardsQuery>) => {
                    return result.data as AccountFlowsAsCardsQuery;
                }),
            );
    }

    public fetchAccountPrimaryCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<AccountPrimaryCardsQuery> {
        return this.accountPrimaryCardsGQL
            .watch({
                variables: {
                    name: params.accountName,
                    page: params.page,
                    perPage: params.perPage,
                    filters: params.filters,
                    ordering: params.ordering,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountPrimaryCardsQuery>) => {
                    return result.data as AccountPrimaryCardsQuery;
                }),
            );
    }

    public fetchAccountWebhookCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<AccountWebhookCardsQuery> {
        return this.accountWebhookCardsGQL
            .watch({
                variables: {
                    name: params.accountName,
                    page: params.page,
                    perPage: params.perPage,
                    filters: params.filters,
                    ordering: params.ordering,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountWebhookCardsQuery>) => {
                    return result.data as AccountWebhookCardsQuery;
                }),
            );
    }

    public accountDatasetsWithFlows(accountName: string): Observable<AccountListDatasetsWithFlowsQuery> {
        return this.accountListDatasetsWithFlowsGql
            .watch({
                variables: { name: accountName },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                map((result: ObservableQuery.Result<AccountListDatasetsWithFlowsQuery>) => {
                    return result.data as AccountListDatasetsWithFlowsQuery;
                }),
            );
    }

    public accountFlowsPaused(accountName: string): Observable<AccountDatasetFlowsPausedQuery> {
        return this.accountDatasetFlowsPausedGql
            .watch({
                variables: { accountName },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                map((result: ObservableQuery.Result<AccountDatasetFlowsPausedQuery>) => {
                    return result.data as AccountDatasetFlowsPausedQuery;
                }),
            );
    }

    public accountPauseFlows(accountName: string): Observable<AccountPauseFlowsMutation> {
        return this.accountPauseFlowsGql
            .mutate({
                variables: {
                    accountName,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<AccountPauseFlowsMutation>) => {
                    return result.data as AccountPauseFlowsMutation;
                }),
            );
    }

    public accountResumeFlows(accountName: string): Observable<AccountResumeFlowsMutation> {
        return this.accountResumeFlowsGql
            .mutate({
                variables: {
                    accountName,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<AccountResumeFlowsMutation>) => {
                    return result.data as AccountResumeFlowsMutation;
                }),
            );
    }

    public deleteAccountByName(accountName: string): Observable<DeleteAccountByNameMutation> {
        return this.deleteAccountByNameGQL
            .mutate({
                variables: {
                    accountName,
                },
            })
            .pipe(
                first(),
                map((result: ApolloLink.Result<DeleteAccountByNameMutation>) => {
                    return result.data as DeleteAccountByNameMutation;
                }),
            );
    }
}
