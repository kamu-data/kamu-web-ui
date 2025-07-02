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
import { provideToastr, ToastrService } from "ngx-toastr";
import {
    mockAccountDatasetFlowsPausedQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockAccountPauseFlowsMutationError,
    mockAccountPauseFlowsMutationSuccess,
    mockAccountResumeFlowsMutationError,
    mockAccountResumeFlowsMutationSuccess,
    mockChangeAccountUsernameMutation,
    mockChangeAccountUsernameMutationError,
    mockChangeAdminPasswordMutation,
    mockChangeAdminPasswordMutationError,
    mockChangeUserPasswordMutation,
    mockChangeUserPasswordMutationError,
    mockDeleteAccountByNameMutation,
} from "../api/mock/account.mock";
import { FlowsTableData } from "../dataset-flow/flows-table/flows-table.types";
import { ChangeAccountUsernameResult } from "./settings/account-settings.constants";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("AccountService", () => {
    let service: AccountService;
    let accountApi: AccountApi;
    let datasetApi: DatasetApi;
    let toastService: ToastrService;
    const NEW_PASSWORD = "new-password";
    const OLD_PASSWORD = "old-password";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideAnimations(), provideToastr()],
            imports: [ApolloTestingModule],
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

    it("should check delete account by name", () => {
        spyOn(accountApi, "deleteAccountByName").and.returnValue(of(mockDeleteAccountByNameMutation));

        const subscription$ = service.deleteAccountByName(TEST_LOGIN).subscribe((result: boolean) => {
            expect(result).toEqual(true);
        });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change account username with success", () => {
        spyOn(accountApi, "changeAccountUsername").and.returnValue(of(mockChangeAccountUsernameMutation));

        const subscription$ = service
            .changeAccountUsername({ accountName: TEST_LOGIN, newName: "new-account-name" })
            .subscribe((result: ChangeAccountUsernameResult) => {
                expect(result).toEqual({ changed: true, name: result.name });
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change account username with error", () => {
        spyOn(accountApi, "changeAccountUsername").and.returnValue(of(mockChangeAccountUsernameMutationError));

        const subscription$ = service
            .changeAccountUsername({ accountName: TEST_LOGIN, newName: "new-account-name" })
            .subscribe((result: ChangeAccountUsernameResult) => {
                expect(result).toEqual({ changed: false, name: TEST_LOGIN });
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change password for admin", () => {
        spyOn(accountApi, "changeAdminPassword").and.returnValue(of(mockChangeAdminPasswordMutation));

        const subscription$ = service
            .changeAdminPassword({ accountName: TEST_LOGIN, password: NEW_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change password for admin with error", () => {
        spyOn(accountApi, "changeAdminPassword").and.returnValue(of(mockChangeAdminPasswordMutationError));

        const subscription$ = service
            .changeAdminPassword({ accountName: TEST_LOGIN, password: NEW_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change password for user", () => {
        spyOn(accountApi, "changeUserPassword").and.returnValue(of(mockChangeUserPasswordMutation));

        const subscription$ = service
            .changeUserPassword({ accountName: TEST_LOGIN, newPassword: NEW_PASSWORD, oldPassword: OLD_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBeTrue();
    });

    it("should check change password for user with error", () => {
        spyOn(accountApi, "changeUserPassword").and.returnValue(of(mockChangeUserPasswordMutationError));

        const subscription$ = service
            .changeUserPassword({ accountName: TEST_LOGIN, newPassword: NEW_PASSWORD, oldPassword: OLD_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
            });

        expect(subscription$.closed).toBeTrue();
    });
});
