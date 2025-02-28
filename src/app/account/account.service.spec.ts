/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetApi } from "src/app/api/dataset.api";
import { TestBed } from "@angular/core/testing";
import { AccountService } from "./account.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "../api/account.api";
import { TEST_LOGIN, TEST_PAGE_NUMBER, mockAccountDetails } from "../api/mock/auth.mock";
import { first, of } from "rxjs";
import { MaybeNull, MaybeUndefined } from "../interface/app.types";
import { AccountFlowFilters, AccountFragment, Dataset } from "../api/kamu.graphql.interface";
import { mockDatasetsByAccountNameQuery } from "../api/mock/dataset.mock";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { ToastrModule, ToastrService } from "ngx-toastr";
import {
    mockAccountDatasetFlowsPausedQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockAccountPauseFlowsMutationError,
    mockAccountPauseFlowsMutationSuccess,
    mockAccountResumeFlowsMutationError,
    mockAccountResumeFlowsMutationSuccess,
} from "../api/mock/account.mock";
import { FlowsTableData } from "../dataset-flow/flows-table/flows-table.types";

describe("AccountService", () => {
    let service: AccountService;
    let accountApi: AccountApi;
    let datasetApi: DatasetApi;
    let toastService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(AccountService);
        toastService = TestBed.inject(ToastrService);
        accountApi = TestBed.inject(AccountApi);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("check fetchAccountByName", () => {
        const apiAccountByNameSpy = spyOn(accountApi, "fetchAccountByName").and.returnValue(of(mockAccountDetails));

        const subscription$ = service
            .fetchAccountByName(TEST_LOGIN)
            .pipe(first())
            .subscribe((account: MaybeNull<AccountFragment>) => {
                expect(account).toEqual(mockAccountDetails);
            });

        expect(apiAccountByNameSpy).toHaveBeenCalledWith(TEST_LOGIN);
        expect(subscription$.closed).toBeTrue();
    });

    it("check fetchMultipleAccountsByName", () => {
        const apiAccountByNameSpy = spyOn(accountApi, "fetchAccountByName").and.returnValues(
            of(mockAccountDetails),
            of(null),
        );

        const subscription$ = service
            .fetchMultipleAccountsByName([TEST_LOGIN, "non-existing-user"])
            .pipe(first())
            .subscribe((accountsByName: Map<string, AccountFragment>) => {
                expect(accountsByName.size).toEqual(1);
                expect(accountsByName.get(TEST_LOGIN)).toEqual(mockAccountDetails);
            });

        expect(apiAccountByNameSpy).toHaveBeenCalledTimes(2);
        expect(subscription$.closed).toBeTrue();
    });

    it("check getDatasetsByAccountName", () => {
        const fetchDatasetsByAccountNameSpy = spyOn(datasetApi, "fetchDatasetsByAccountName").and.returnValue(
            of(mockDatasetsByAccountNameQuery),
        );

        const subscription$ = service
            .getDatasetsByAccountName(TEST_LOGIN, TEST_PAGE_NUMBER)
            .pipe(first())
            .subscribe((data: DatasetsAccountResponse) => {
                expect(data.datasetTotalCount).toEqual(
                    mockDatasetsByAccountNameQuery.datasets.byAccountName.totalCount,
                );
                expect(data.pageInfo).toEqual(mockDatasetsByAccountNameQuery.datasets.byAccountName.pageInfo);
                expect(data.datasets).toEqual(mockDatasetsByAccountNameQuery.datasets.byAccountName.nodes);
            });

        expect(fetchDatasetsByAccountNameSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("check getDatasetsWithFlows", () => {
        const accountDatasetsWithFlowsSpy = spyOn(accountApi, "accountDatasetsWithFlows").and.returnValue(
            of(mockAccountListDatasetsWithFlowsQuery),
        );

        const subscription$ = service
            .getDatasetsWithFlows(TEST_LOGIN)
            .pipe(first())
            .subscribe((data: Dataset[]) => {
                const listDatasets =
                    mockAccountListDatasetsWithFlowsQuery.accounts.byName?.flows?.runs.listDatasetsWithFlow;
                expect(data.length).toEqual(listDatasets?.nodes.length as number);
                expect(data[0].name).toEqual("account.tokens.transfers");
            });

        expect(accountDatasetsWithFlowsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("should resumed all flows for account with success", () => {
        spyOn(accountApi, "accountResumeFlows").and.returnValue(of(mockAccountResumeFlowsMutationSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service.accountResumeFlows(TEST_LOGIN).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows resumed");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should resume all flows for account with error", () => {
        spyOn(accountApi, "accountResumeFlows").and.returnValue(of(mockAccountResumeFlowsMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.accountResumeFlows(TEST_LOGIN).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not resumed");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should pause all flows for account with success", () => {
        spyOn(accountApi, "accountPauseFlows").and.returnValue(of(mockAccountPauseFlowsMutationSuccess));
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        const subscription$ = service.accountPauseFlows(TEST_LOGIN).subscribe(() => {
            expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Flows paused");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should pause all flows for account with error", () => {
        spyOn(accountApi, "accountPauseFlows").and.returnValue(of(mockAccountPauseFlowsMutationError));
        const toastrServiceErrorSpy = spyOn(toastService, "error");

        const subscription$ = service.accountPauseFlows(TEST_LOGIN).subscribe(() => {
            expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Error, flows not paused");
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check state for all flows for account paused", () => {
        spyOn(accountApi, "accountFlowsPaused").and.returnValue(of(mockAccountDatasetFlowsPausedQuery));

        const subscription$ = service.accountAllFlowsPaused(TEST_LOGIN).subscribe((paused: MaybeUndefined<boolean>) => {
            expect(paused).toEqual(true);
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("check getAccountListFlows", () => {
        spyOn(accountApi, "fetchAccountListFlows").and.returnValue(of(mockAccountListFlowsQuery));
        spyOn(accountApi, "accountDatasetsWithFlows").and.returnValue(of(mockAccountListDatasetsWithFlowsQuery));
        const PAGE = 1;
        const PER_PAGE = 15;
        const ACCOUNT_FILTERS: AccountFlowFilters = {
            byDatasetIds: [],
            byFlowType: null,
            byInitiator: null,
            byStatus: null,
        };
        const subscription$ = service
            .getAccountListFlows({
                accountName: TEST_LOGIN,
                page: PAGE,
                perPageTable: PER_PAGE,
                perPageTiles: PER_PAGE,
                filters: ACCOUNT_FILTERS,
            })
            .subscribe((data: FlowsTableData) => {
                expect(data.connectionDataForTable.nodes.length).toEqual(1);
                expect(data.involvedDatasets.length).toEqual(4);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
