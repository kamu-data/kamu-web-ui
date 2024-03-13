import { AccountFragment } from "../api/kamu.graphql.interface";
import { AccountApi } from "../api/account.api";
import { Observable, forkJoin } from "rxjs";
import { DatasetApi } from "../api/dataset.api";
import { Injectable } from "@angular/core";
import { DatasetsByAccountNameQuery } from "../api/kamu.graphql.interface";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { map } from "rxjs/operators";
import { MaybeNull } from "../common/app.types";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    constructor(
        private datasetApi: DatasetApi,
        private accountApi: AccountApi,
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
}
