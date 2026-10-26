/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { first, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { AccountApi } from "@api/account.api";
import { DatasetApi } from "@api/dataset.api";
import {
    AccountFlowFilters,
    AccountFragment,
    DatasetWithFlowsDataFragment,
    FlowProcessOrderField,
    OrderingDirection,
} from "@api/kamu.graphql.interface";
import {
    mockAccountFlowsAsCardsQuery,
    mockAccountFlowsPrimaryCardsQuery,
    mockAccountFlowsWebhookCardsQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockChangeAccountUsernameMutation,
    mockChangeAccountUsernameMutationError,
    mockChangeAdminPasswordMutation,
    mockChangeAdminPasswordMutationError,
    mockChangeUserPasswordMutation,
    mockChangeUserPasswordMutationError,
    mockDeleteAccountByNameMutation,
} from "@api/mock/account.mock";
import { mockAccountDetails, TEST_LOGIN, TEST_PAGE_NUMBER } from "@api/mock/auth.mock";
import { mockDatasetsByAccountNameQuery } from "@api/mock/dataset.mock";
import { MaybeNull } from "@interface/app.types";
import { DatasetsAccountResponse } from "@interface/dataset.interface";

import { AccountService } from "src/app/account/account.service";
import { CardsStrategyResult } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { ChangeAccountUsernameResult } from "src/app/account/settings/account-settings.constants";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";

describe("AccountService", () => {
    let service: AccountService;
    let accountApi: AccountApi;
    let datasetApi: DatasetApi;
    const NEW_PASSWORD = "new-password";
    const OLD_PASSWORD = "old-password";
    const ACCOUNT_NAME = "accountName";
    const PAGE = 1;
    const PER_PAGE = 15;
    const CARDS_PARAMS = {
        accountName: ACCOUNT_NAME,
        page: PAGE,
        perPage: PER_PAGE,
        filters: { effectiveStateIn: [] },
        ordering: { direction: OrderingDirection.Asc, field: FlowProcessOrderField.EffectiveState },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(AccountService);
        accountApi = TestBed.inject(AccountApi);
        datasetApi = TestBed.inject(DatasetApi);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("check fetchAccountByName", () => {
        const apiAccountByNameSpy = vi.spyOn(accountApi, "fetchAccountByName").mockReturnValue(of(mockAccountDetails));

        const subscription$ = service
            .fetchAccountByName(TEST_LOGIN)
            .pipe(first())
            .subscribe((account: MaybeNull<AccountFragment>) => {
                expect(account).toEqual(mockAccountDetails);
            });

        expect(apiAccountByNameSpy).toHaveBeenCalledWith(TEST_LOGIN);
        expect(subscription$.closed).toBe(true);
    });

    it("check fetchMultipleAccountsByName", () => {
        const apiAccountByNameSpy = vi
            .spyOn(accountApi, "fetchAccountByName")
            .mockReturnValueOnce(of(mockAccountDetails))
            .mockReturnValueOnce(of(null));

        const subscription$ = service
            .fetchMultipleAccountsByName([TEST_LOGIN, "non-existing-user"])
            .pipe(first())
            .subscribe((accountsByName: Map<string, AccountFragment>) => {
                expect(accountsByName.size).toEqual(1);
                expect(accountsByName.get(TEST_LOGIN)).toEqual(mockAccountDetails);
            });

        expect(apiAccountByNameSpy).toHaveBeenCalledTimes(2);
        expect(subscription$.closed).toBe(true);
    });

    it("check getDatasetsByAccountName", () => {
        const fetchDatasetsByAccountNameSpy = vi
            .spyOn(datasetApi, "fetchDatasetsByAccountName")
            .mockReturnValue(of(mockDatasetsByAccountNameQuery));

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
        expect(subscription$.closed).toBe(true);
    });

    it("check getDatasetsWithFlows", () => {
        const accountDatasetsWithFlowsSpy = vi
            .spyOn(accountApi, "accountDatasetsWithFlows")
            .mockReturnValue(of(mockAccountListDatasetsWithFlowsQuery));

        const subscription$ = service
            .getDatasetsWithFlows(TEST_LOGIN)
            .pipe(first())
            .subscribe((data: DatasetWithFlowsDataFragment[]) => {
                const listDatasets =
                    mockAccountListDatasetsWithFlowsQuery.accounts.byName?.flows?.runs.listDatasetsWithFlow;
                expect(data.length).toEqual(requireValue(listDatasets ?? null).nodes.length);
                expect(data[0].name).toEqual("account.tokens.transfers");
                expect(requireValue(listDatasets ?? null).nodes[0].name).toEqual("baccount.tokens.transfers");
            });

        expect(accountDatasetsWithFlowsSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("check getAccountListFlows", () => {
        vi.spyOn(accountApi, "fetchAccountListFlows").mockReturnValue(of(mockAccountListFlowsQuery));
        vi.spyOn(accountApi, "accountDatasetsWithFlows").mockReturnValue(of(mockAccountListDatasetsWithFlowsQuery));
        const PAGE = 1;
        const PER_PAGE = 15;
        const ACCOUNT_FILTERS: AccountFlowFilters = {
            byDatasetIds: [],
            byProcessType: null,
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

        expect(subscription$.closed).toBe(true);
    });

    it("should check delete account by name", () => {
        vi.spyOn(accountApi, "deleteAccountByName").mockReturnValue(of(mockDeleteAccountByNameMutation));

        const subscription$ = service.deleteAccountByName(TEST_LOGIN).subscribe((result: boolean) => {
            expect(result).toEqual(true);
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change account username with success", () => {
        vi.spyOn(accountApi, "changeAccountUsername").mockReturnValue(of(mockChangeAccountUsernameMutation));

        const subscription$ = service
            .changeAccountUsername({ accountName: TEST_LOGIN, newName: "new-account-name" })
            .subscribe((result: ChangeAccountUsernameResult) => {
                expect(result).toEqual({ changed: true, name: result.name });
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change account username with error", () => {
        vi.spyOn(accountApi, "changeAccountUsername").mockReturnValue(of(mockChangeAccountUsernameMutationError));

        const subscription$ = service
            .changeAccountUsername({ accountName: TEST_LOGIN, newName: "new-account-name" })
            .subscribe((result: ChangeAccountUsernameResult) => {
                expect(result).toEqual({ changed: false, name: TEST_LOGIN });
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change password for admin", () => {
        vi.spyOn(accountApi, "changeAdminPassword").mockReturnValue(of(mockChangeAdminPasswordMutation));

        const subscription$ = service
            .changeAdminPassword({ accountName: TEST_LOGIN, password: NEW_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change password for admin with error", () => {
        vi.spyOn(accountApi, "changeAdminPassword").mockReturnValue(of(mockChangeAdminPasswordMutationError));

        const subscription$ = service
            .changeAdminPassword({ accountName: TEST_LOGIN, password: NEW_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change password for user", () => {
        vi.spyOn(accountApi, "changeUserPassword").mockReturnValue(of(mockChangeUserPasswordMutation));

        const subscription$ = service
            .changeUserPassword({ accountName: TEST_LOGIN, newPassword: NEW_PASSWORD, oldPassword: OLD_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(true);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check change password for user with error", () => {
        vi.spyOn(accountApi, "changeUserPassword").mockReturnValue(of(mockChangeUserPasswordMutationError));

        const subscription$ = service
            .changeUserPassword({ accountName: TEST_LOGIN, newPassword: NEW_PASSWORD, oldPassword: OLD_PASSWORD })
            .subscribe((result: boolean) => {
                expect(result).toEqual(false);
            });

        expect(subscription$.closed).toBe(true);
    });

    it("should check get flows all cards", () => {
        vi.spyOn(accountApi, "fetchAccountFlowsAsCards").mockReturnValue(of(mockAccountFlowsAsCardsQuery));

        const subscription$ = service.getAccountAllCards(CARDS_PARAMS).subscribe((result: CardsStrategyResult) => {
            expect(result.cards).toEqual(
                requireValue(mockAccountFlowsAsCardsQuery.accounts.byName ?? null).flows.processes.allCards,
            );
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check get flows primary cards", () => {
        vi.spyOn(accountApi, "fetchAccountPrimaryCards").mockReturnValue(of(mockAccountFlowsPrimaryCardsQuery));

        const subscription$ = service.getAccountPrimaryCards(CARDS_PARAMS).subscribe((result: CardsStrategyResult) => {
            expect(result.cards).toEqual(
                requireValue(mockAccountFlowsPrimaryCardsQuery.accounts.byName ?? null).flows.processes.primaryCards,
            );
        });

        expect(subscription$.closed).toBe(true);
    });

    it("should check get flows webhook cards", () => {
        vi.spyOn(accountApi, "fetchAccountWebhookCards").mockReturnValue(of(mockAccountFlowsWebhookCardsQuery));

        const subscription$ = service.getAccountWebhookCards(CARDS_PARAMS).subscribe((result: CardsStrategyResult) => {
            expect(result.cards).toEqual(
                requireValue(mockAccountFlowsWebhookCardsQuery.accounts.byName ?? null).flows.processes.webhookCards,
            );
        });

        expect(subscription$.closed).toBe(true);
    });
});
