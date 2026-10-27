/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { combineLatest, forkJoin, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";

import { AccountApi } from "@api/account.api";
import { DatasetApi } from "@api/dataset.api";
import {
    AccountFlowFilters,
    AccountFlowsAsCardsQuery,
    AccountFragment,
    AccountListDatasetsWithFlowsQuery,
    AccountPrimaryCardsQuery,
    AccountWebhookCardsQuery,
    ChangeAccountUsernameMutation,
    ChangeAdminPasswordMutation,
    ChangeUserPasswordMutation,
    DatasetsByAccountNameQuery,
    DatasetsTotalCountByAccountNameQuery,
    DatasetWithFlowsDataFragment,
    DeleteAccountByNameMutation,
    FlowProcessFilters,
    FlowProcessOrdering,
    FlowRunOrder,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";
import { DatasetsAccountResponse } from "@interface/dataset.interface";

import { CardsStrategyResult } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { ChangeAccountUsernameResult } from "src/app/account/settings/account-settings.constants";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    private datasetApi = inject(DatasetApi);
    private accountApi = inject(AccountApi);
    private toastrService = inject(ToastrService);

    public getDatasetsByAccountName(name: string, page: number): Observable<DatasetsAccountResponse> {
        return this.datasetApi.fetchDatasetsByAccountName(name, page).pipe(
            map((data: DatasetsByAccountNameQuery) => {
                const datasets = data.datasets.byAccountName.nodes;
                const pageInfo = data.datasets.byAccountName.pageInfo;
                const datasetTotalCount = data.datasets.byAccountName.totalCount;
                return { datasets, pageInfo, datasetTotalCount };
            }),
        );
    }

    public getDatasetsTotalCountByAccountName(name: string): Observable<number> {
        return this.datasetApi.fetchDatasetsTotalCountByAccountName(name).pipe(
            map((data: DatasetsTotalCountByAccountNameQuery) => {
                return data.datasets.byAccountName.totalCount;
            }),
        );
    }

    public fetchAccountByName(name: string): Observable<MaybeNull<AccountFragment>> {
        return this.accountApi.fetchAccountByName(name);
    }

    public fetchMultipleAccountsByName(accountNames: string[]): Observable<Map<string, AccountFragment>> {
        const accountObservables$: Observable<MaybeNull<AccountFragment>>[] = accountNames.map((accountName: string) =>
            this.fetchAccountByName(accountName),
        );

        return forkJoin(accountObservables$).pipe(
            map((accounts: MaybeNull<AccountFragment>[]) => {
                const accountsByName = new Map<string, AccountFragment>();
                accounts.forEach((account: MaybeNull<AccountFragment>) => {
                    if (account) {
                        accountsByName.set(account.accountName, account);
                    }
                });
                return accountsByName;
            }),
        );
    }

    public getAccountListFlows(params: {
        accountName: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: AccountFlowFilters;
        order?: FlowRunOrder;
    }): Observable<FlowsTableData> {
        return combineLatest([
            this.accountApi.fetchAccountListFlows(params),
            this.getDatasetsWithFlows(params.accountName),
        ]).pipe(
            map(([listFlows, involvedDatasets]) => ({ account: listFlows.accounts.byName, involvedDatasets })),
            filter(AccountService.hasAccount),
            map(({ account, involvedDatasets }) => ({
                connectionDataForTable: account.flows.runs.table,
                connectionDataForWidget: account.flows.runs.tiles,
                involvedDatasets,
            })),
        );
    }

    public getAccountAllCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<CardsStrategyResult> {
        return this.accountApi.fetchAccountFlowsAsCards(params).pipe(
            map((data: AccountFlowsAsCardsQuery) => ({ account: data.accounts.byName })),
            filter(AccountService.hasAccount),
            map(({ account }) => ({
                cards: account.flows.processes.allCards,
                rollup: account.flows.processes.fullRollup,
            })),
        );
    }

    public getAccountPrimaryCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<CardsStrategyResult> {
        return this.accountApi.fetchAccountPrimaryCards(params).pipe(
            map((data: AccountPrimaryCardsQuery) => ({ account: data.accounts.byName })),
            filter(AccountService.hasAccount),
            map(({ account }) => ({
                cards: account.flows.processes.primaryCards,
                rollup: account.flows.processes.primaryRollup,
            })),
        );
    }

    public getAccountWebhookCards(params: {
        accountName: string;
        page: number;
        perPage: number;
        filters: FlowProcessFilters;
        ordering: FlowProcessOrdering;
    }): Observable<CardsStrategyResult> {
        return this.accountApi.fetchAccountWebhookCards(params).pipe(
            map((data: AccountWebhookCardsQuery) => ({ account: data.accounts.byName })),
            filter(AccountService.hasAccount),
            map(({ account }) => ({
                cards: account.flows.processes.webhookCards,
                rollup: account.flows.processes.webhookRollup,
            })),
        );
    }

    public getDatasetsWithFlows(accounName: string): Observable<DatasetWithFlowsDataFragment[]> {
        return this.accountApi.accountDatasetsWithFlows(accounName).pipe(
            map((data: AccountListDatasetsWithFlowsQuery) => {
                const datasets = data.accounts.byName?.flows.runs.listDatasetsWithFlow.nodes ?? [];
                return [...datasets].sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                });
            }),
        );
    }

    public deleteAccountByName(accountName: string): Observable<boolean> {
        return this.accountApi.deleteAccountByName(accountName).pipe(
            map((data: DeleteAccountByNameMutation) => {
                if (data.accounts.byName?.delete.__typename === "DeleteAccountSuccess") {
                    return true;
                }
                return false;
            }),
        );
    }

    public changeAccountUsername(params: {
        accountName: string;
        newName: string;
    }): Observable<ChangeAccountUsernameResult> {
        return this.accountApi.changeAccountUsername(params).pipe(
            map((data: ChangeAccountUsernameMutation) => {
                if (data.accounts.byName?.rename.__typename === "RenameAccountSuccess") {
                    this.toastrService.success(data.accounts.byName?.rename.message);
                    return { changed: true, name: data.accounts.byName?.rename.newName };
                } else if (data.accounts.byName?.rename.__typename === "RenameAccountNameNotUnique") {
                    this.toastrService.error(data.accounts.byName?.rename.message);
                }
                return { changed: false, name: params.accountName };
            }),
        );
    }

    public changeAdminPassword(params: { accountName: string; password: string }): Observable<boolean> {
        return this.accountApi.changeAdminPassword(params).pipe(
            map((data: ChangeAdminPasswordMutation) => {
                if (data.accounts.byName?.modifyPassword.__typename === "ModifyPasswordSuccess") {
                    this.toastrService.success(data.accounts.byName?.modifyPassword.message);
                    return true;
                }
                this.toastrService.error("Password not changed");
                return false;
            }),
        );
    }

    public changeUserPassword(params: {
        accountName: string;
        oldPassword: string;
        newPassword: string;
    }): Observable<boolean> {
        return this.accountApi.changeUserPassword(params).pipe(
            map((data: ChangeUserPasswordMutation) => {
                if (data.accounts.byName?.modifyPasswordWithConfirmation.__typename === "ModifyPasswordSuccess") {
                    this.toastrService.success(data.accounts.byName?.modifyPasswordWithConfirmation.message);
                    return true;
                }
                this.toastrService.error(data.accounts.byName?.modifyPasswordWithConfirmation.message);
                return false;
            }),
        );
    }

    /** Whether a query found its account; one renamed or deleted since the page loaded leaves a poll without data. */
    private static hasAccount<T extends { account: MaybeNullOrUndefined<object> }>(
        value: T,
    ): value is T & { account: NonNullable<T["account"]> } {
        return Boolean(value.account);
    }
}
