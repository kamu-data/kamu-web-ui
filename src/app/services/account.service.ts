import { AccountDetailsFragment } from "./../api/kamu.graphql.interface";
import { AccountApi } from "./../api/account.api";
import { Observable, Subject } from "rxjs";
import { DatasetApi } from "./../api/dataset.api";
import { Injectable } from "@angular/core";
import { DatasetsByAccountNameQuery } from "../api/kamu.graphql.interface";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class AccountService {
    constructor(
        private datasetApi: DatasetApi,
        private accountApi: AccountApi,
    ) {}

    private accountInfoChanges$: Subject<AccountDetailsFragment> =
        new Subject<AccountDetailsFragment>();

    public get onAccountInfoChanges(): Observable<AccountDetailsFragment> {
        return this.accountInfoChanges$.asObservable();
    }

    public accountInfoChanges(info: AccountDetailsFragment): void {
        this.accountInfoChanges$.next(info);
    }

    private datasetsChanges$: Subject<DatasetsAccountResponse> =
        new Subject<DatasetsAccountResponse>();

    public get onDatasetsChanges(): Observable<DatasetsAccountResponse> {
        return this.datasetsChanges$.asObservable();
    }

    public datasetsChanges(datasetsInfo: DatasetsAccountResponse): void {
        this.datasetsChanges$.next(datasetsInfo);
    }

    public getDatasetsByAccountName(
        name: string,
        page: number,
    ): Observable<void> {
        return this.datasetApi.fetchDatasetsByAccountName(name, page).pipe(
            map((data: DatasetsByAccountNameQuery) => {
                const datasets = data.datasets.byAccountName.nodes;
                const pageInfo = data.datasets.byAccountName.pageInfo;
                const datasetTotalCount =
                    data.datasets.byAccountName.totalCount;
                this.datasetsChanges({ datasets, pageInfo, datasetTotalCount });
            }),
        );
    }

    public getAccountInfoByAccountName(name: string): Observable<void> {
        return this.accountApi.getAccountInfoByName(name).pipe(
            map((info: AccountDetailsFragment) => {
                this.accountInfoChanges(info);
            }),
        );
    }
}