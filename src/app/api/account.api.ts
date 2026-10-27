/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { catchError, EMPTY, first, map, Observable } from "rxjs";

import { ObservableQuery } from "@apollo/client/core";
import { onlyCompleteData } from "apollo-angular";

import { mutationData } from "@common/helpers/apollo-error.helpers";
import { noCacheFetchPolicy } from "@common/helpers/data.helpers";
import {
    AccountByNameGQL,
    AccountByNameQuery,
    AccountChangeEmailGQL,
    AccountChangeEmailMutation,
    AccountFlowFilters,
    AccountFlowsAsCardsGQL,
    AccountFlowsAsCardsQuery,
    AccountFragment,
    AccountListDatasetsWithFlowsGQL,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsGQL,
    AccountListFlowsQuery,
    AccountPrimaryCardsGQL,
    AccountPrimaryCardsQuery,
    AccountStorageQuotaGQL,
    AccountStorageQuotaQuery,
    AccountWebhookCardsGQL,
    AccountWebhookCardsQuery,
    AccountWithEmailGQL,
    AccountWithEmailQuery,
    ChangeAccountUsernameGQL,
    ChangeAccountUsernameMutation,
    ChangeAdminPasswordGQL,
    ChangeAdminPasswordMutation,
    ChangeUserPasswordGQL,
    ChangeUserPasswordMutation,
    DeleteAccountByNameGQL,
    DeleteAccountByNameMutation,
    FlowProcessFilters,
    FlowProcessOrdering,
    FlowRunOrder,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Injectable({ providedIn: "root" })
export class AccountApi {
    private accountByNameGql = inject(AccountByNameGQL);
    private accountListFlowsGql = inject(AccountListFlowsGQL);
    private accountListDatasetsWithFlowsGql = inject(AccountListDatasetsWithFlowsGQL);
    private accountWithEmailGql = inject(AccountWithEmailGQL);
    private accountStorageQuotaGql = inject(AccountStorageQuotaGQL);
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
            .pipe(first(), mutationData());
    }

    public changeAccountEmail(params: {
        accountName: string;
        newEmail: string;
    }): Observable<AccountChangeEmailMutation> {
        return this.accountChangeEmailGQL.mutate({ variables: params }).pipe(first(), mutationData());
    }

    public changeAdminPassword(params: {
        accountName: string;
        password: string;
    }): Observable<ChangeAdminPasswordMutation> {
        return this.changeAdminPasswordGQL.mutate({ variables: params }).pipe(first(), mutationData());
    }

    public changeUserPassword(params: {
        accountName: string;
        oldPassword: string;
        newPassword: string;
    }): Observable<ChangeUserPasswordMutation> {
        return this.changeUserPasswordGQL.mutate({ variables: params }).pipe(
            first(),
            mutationData(),
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
                map((result: ObservableQuery.Result<AccountWithEmailQuery, "complete">) => {
                    return result.data;
                }),
            );
    }

    public fetchAccountStorageQuota(accountName: string): Observable<AccountStorageQuotaQuery> {
        return this.accountStorageQuotaGql
            .watch({
                variables: {
                    accountName,
                },
                ...noCacheFetchPolicy,
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountStorageQuotaQuery, "complete">) => {
                    return result.data;
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
                map((result: ObservableQuery.Result<AccountByNameQuery, "complete">) => {
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
        order?: FlowRunOrder;
    }): Observable<AccountListFlowsQuery> {
        return this.accountListFlowsGql
            .watch({
                variables: {
                    name: params.accountName,
                    page: params.page,
                    perPageTable: params.perPageTable,
                    perPageTiles: params.perPageTiles,
                    filters: params.filters,
                    order: params.order,
                },
                ...noCacheFetchPolicy,
                context: {
                    skipLoading: true,
                },
            })
            .valueChanges.pipe(
                onlyCompleteData(),
                first(),
                map((result: ObservableQuery.Result<AccountListFlowsQuery, "complete">) => {
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
                map((result: ObservableQuery.Result<AccountFlowsAsCardsQuery, "complete">) => {
                    return result.data;
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
                map((result: ObservableQuery.Result<AccountPrimaryCardsQuery, "complete">) => {
                    return result.data;
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
                map((result: ObservableQuery.Result<AccountWebhookCardsQuery, "complete">) => {
                    return result.data;
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
                map((result: ObservableQuery.Result<AccountListDatasetsWithFlowsQuery, "complete">) => {
                    return result.data;
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
            .pipe(first(), mutationData());
    }
}
