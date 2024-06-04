import { MaybeUndefined } from "./../common/app.types";
import {
    AccountDatasetFlowsPausedQuery,
    AccountListDatasetsWithFlowsQuery,
    AccountPauseFlowsMutation,
    AccountResumeFlowsMutation,
    Dataset,
} from "./../api/kamu.graphql.interface";
import {
    AccountFlowFilters,
    AccountFragment,
    AccountListFlowsQuery,
    FlowConnectionDataFragment,
} from "../api/kamu.graphql.interface";
import { AccountApi } from "../api/account.api";
import { Observable, forkJoin } from "rxjs";
import { DatasetApi } from "../api/dataset.api";
import { Injectable } from "@angular/core";
import { DatasetsByAccountNameQuery } from "../api/kamu.graphql.interface";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { map } from "rxjs/operators";
import { MaybeNull } from "../common/app.types";
import { FlowsTableData } from "../dataset-view/additional-components/flows-component/components/flows-table/flows-table.types";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    constructor(
        private datasetApi: DatasetApi,
        private accountApi: AccountApi,
        private toastrService: ToastrService,
    ) {}

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
        accounName: string;
        page: number;
        perPage: number;
        filters: AccountFlowFilters;
    }): Observable<FlowsTableData> {
        return this.accountApi.fetchAccountListFlows(params).pipe(
            map((data: AccountListFlowsQuery) => {
                return {
                    connectionData: data.accounts.byName?.flows?.runs.listFlows as FlowConnectionDataFragment,
                    source: undefined,
                    transformData: undefined,
                };
            }),
        );
    }

    public getDatasetsWithFlows(accounName: string): Observable<Dataset[]> {
        return this.accountApi.accountDatasetsWithFlows(accounName).pipe(
            map((data: AccountListDatasetsWithFlowsQuery) => {
                return (data.accounts.byName?.flows?.runs.listDatasetsWithFlow.nodes as Dataset[]) ?? [];
            }),
        );
    }

    public accountAllFlowsPaused(accountName: string): Observable<MaybeUndefined<boolean>> {
        return this.accountApi.accountFlowsPaused(accountName).pipe(
            map((data: AccountDatasetFlowsPausedQuery) => {
                return data.accounts.byName?.flows?.configs.allPaused;
            }),
        );
    }

    public accountPauseFlows(accountName: string): Observable<void> {
        return this.accountApi.accountPauseFlows(accountName).pipe(
            map((data: AccountPauseFlowsMutation) => {
                const result = data.accounts.byName?.flows.configs.pauseAccountDatasetFlows;
                result
                    ? this.toastrService.success("Flows paused")
                    : this.toastrService.error("Error, flows not paused");
            }),
        );
    }

    public accountResumeFlows(accountName: string): Observable<void> {
        return this.accountApi.accountResumeFlows(accountName).pipe(
            map((data: AccountResumeFlowsMutation) => {
                const result = data.accounts.byName?.flows.configs.resumeAccountDatasetFlows;
                result
                    ? this.toastrService.success("Flows resumed")
                    : this.toastrService.error("Error, flows not resumed");
            }),
        );
    }
}
