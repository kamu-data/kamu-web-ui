/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeUndefined } from "../interface/app.types";
import {
    AccountDatasetFlowsPausedQuery,
    AccountListDatasetsWithFlowsQuery,
    AccountPauseFlowsMutation,
    AccountResumeFlowsMutation,
    Dataset,
    DatasetListFlowsDataFragment,
} from "../api/kamu.graphql.interface";
import { AccountFlowFilters, AccountFragment, FlowConnectionDataFragment } from "../api/kamu.graphql.interface";
import { AccountApi } from "../api/account.api";
import { Observable, combineLatest, forkJoin } from "rxjs";
import { DatasetApi } from "../api/dataset.api";
import { inject, Injectable } from "@angular/core";
import { DatasetsByAccountNameQuery } from "../api/kamu.graphql.interface";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { map } from "rxjs/operators";
import { MaybeNull } from "../interface/app.types";
import { ToastrService } from "ngx-toastr";
import { FlowsTableData } from "../dataset-flow/flows-table/flows-table.types";

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
    }): Observable<FlowsTableData> {
        return combineLatest([
            this.accountApi.fetchAccountListFlows(params),
            this.getDatasetsWithFlows(params.accountName),
        ]).pipe(
            map(([listFlows, datasetsWithFlows]) => {
                return {
                    connectionDataForTable: listFlows.accounts.byName?.flows?.runs.table as FlowConnectionDataFragment,
                    connectionDataForWidget: listFlows.accounts.byName?.flows?.runs.tiles as FlowConnectionDataFragment,
                    involvedDatasets: datasetsWithFlows as DatasetListFlowsDataFragment[],
                };
            }),
        );
    }

    public getDatasetsWithFlows(accounName: string): Observable<Dataset[]> {
        return this.accountApi.accountDatasetsWithFlows(accounName).pipe(
            map((data: AccountListDatasetsWithFlowsQuery) => {
                return data.accounts.byName?.flows?.runs.listDatasetsWithFlow.nodes.sort((a, b) => {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    return 0;
                }) as Dataset[];
            }),
        );
    }

    public accountAllFlowsPaused(accountName: string): Observable<MaybeUndefined<boolean>> {
        return this.accountApi.accountFlowsPaused(accountName).pipe(
            map((data: AccountDatasetFlowsPausedQuery) => {
                return data.accounts.byName?.flows?.triggers.allPaused;
            }),
        );
    }

    public accountPauseFlows(accountName: string): Observable<void> {
        return this.accountApi.accountPauseFlows(accountName).pipe(
            map((data: AccountPauseFlowsMutation) => {
                const result = data.accounts.byName?.flows.triggers.pauseAccountDatasetFlows;
                result
                    ? this.toastrService.success("Flows paused")
                    : this.toastrService.error("Error, flows not paused");
            }),
        );
    }

    public accountResumeFlows(accountName: string): Observable<void> {
        return this.accountApi.accountResumeFlows(accountName).pipe(
            map((data: AccountResumeFlowsMutation) => {
                const result = data.accounts.byName?.flows.triggers.resumeAccountDatasetFlows;
                result
                    ? this.toastrService.success("Flows resumed")
                    : this.toastrService.error("Error, flows not resumed");
            }),
        );
    }
}
