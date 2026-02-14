/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "./account.api";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    AccountByNameDocument,
    AccountByNameQuery,
    AccountChangeEmailDocument,
    AccountChangeEmailMutation,
    AccountDatasetFlowsPausedDocument,
    AccountDatasetFlowsPausedQuery,
    AccountFlowFilters,
    AccountFlowsAsCardsDocument,
    AccountFlowsAsCardsQuery,
    AccountFragment,
    AccountListDatasetsWithFlowsDocument,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsDocument,
    AccountListFlowsQuery,
    AccountPauseFlowsDocument,
    AccountPauseFlowsMutation,
    AccountPrimaryCardsDocument,
    AccountPrimaryCardsQuery,
    AccountResumeFlowsDocument,
    AccountResumeFlowsMutation,
    AccountWebhookCardsDocument,
    AccountWebhookCardsQuery,
    AccountWithEmailDocument,
    AccountWithEmailQuery,
    ChangeAccountUsernameDocument,
    ChangeAccountUsernameMutation,
    ChangeAdminPasswordDocument,
    ChangeAdminPasswordMutation,
    ChangeUserPasswordDocument,
    ChangeUserPasswordMutation,
    DatasetFlowProcess,
    DatasetFlowType,
    DeleteAccountByNameDocument,
    DeleteAccountByNameMutation,
    FlowConnectionDataFragment,
    FlowProcessOrderField,
    ModifyPasswordSuccess,
    OrderingDirection,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_EMAIL, TEST_LOGIN, mockAccountDetails } from "./mock/auth.mock";
import { first } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
import {
    mockAccountByNameNotFoundResponse,
    mockAccountByNameResponse,
    mockAccountChangeEmailMutationSuccess,
    mockAccountDatasetFlowsPausedQuery,
    mockAccountFlowsAsCardsQuery,
    mockAccountFlowsPrimaryCardsQuery,
    mockAccountFlowsWebhookCardsQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockAccountPauseFlowsMutationSuccess,
    mockAccountResumeFlowsMutationSuccess,
    mockAccountWithEmailQuery,
    mockChangeAccountUsernameMutation,
    mockChangeAdminPasswordMutation,
    mockChangeUserPasswordMutation,
    mockDeleteAccountByNameMutation,
} from "./mock/account.mock";

describe("AccountApi", () => {
    let service: AccountApi;
    let controller: ApolloTestingController;
    const ACCOUNT_NAME = "accountName";
    const PAGE = 1;
    const PER_PAGE = 15;
    const ACCOUNT_FILTERS: AccountFlowFilters = {
        byDatasetIds: [],
        byProcessType: null,
        byInitiator: null,
        byStatus: null,
    };
    const NEW_PASSWORD = "new-password";
    const OLD_PASSWORD = "old-password";

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AccountApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(AccountApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    interface AccountByNameTestCase {
        expectedAccount: MaybeNull<AccountFragment>;
        emittedResponse: AccountByNameQuery;
    }

    [
        {
            expectedAccount: mockAccountDetails,
            emittedResponse: mockAccountByNameResponse,
        },
        {
            expectedAccount: null,
            emittedResponse: mockAccountByNameNotFoundResponse,
        },
    ].forEach((testCase: AccountByNameTestCase) => {
        it("should execute API call", fakeAsync(() => {
            const subscription$ = service
                .fetchAccountByName(TEST_LOGIN)
                .pipe(first())
                .subscribe((account: MaybeNull<AccountFragment>) => {
                    expect(account).toEqual(testCase.expectedAccount);
                });

            const op = controller.expectOne(AccountByNameDocument);
            expect(op.operation.variables.accountName).toEqual(TEST_LOGIN);

            op.flush({
                data: testCase.emittedResponse,
            });

            tick();

            expect(subscription$.closed).toBeTrue();

            flush();
        }));
    });

    it("should check fetch account list flows", () => {
        service
            .fetchAccountListFlows({
                accountName: ACCOUNT_NAME,
                page: PAGE,
                perPageTable: PER_PAGE,
                perPageTiles: PER_PAGE,
                filters: ACCOUNT_FILTERS,
            })
            .subscribe((list: AccountListFlowsQuery) => {
                expect((list.accounts.byName?.flows?.runs.table as FlowConnectionDataFragment).totalCount).toEqual(
                    (mockAccountListFlowsQuery.accounts.byName?.flows?.runs.table as FlowConnectionDataFragment)
                        .totalCount,
                );
            });

        const op = controller.expectOne(AccountListFlowsDocument);
        expect(op.operation.variables.name).toEqual(ACCOUNT_NAME);
        expect(op.operation.variables.page).toEqual(PAGE);
        expect(op.operation.variables.perPageTable).toEqual(PER_PAGE);
        expect(op.operation.variables.perPageTiles).toEqual(PER_PAGE);
        expect(op.operation.variables.filters).toEqual(ACCOUNT_FILTERS);

        op.flush({
            data: mockAccountListFlowsQuery,
        });
    });

    it("should check fetch account datasets with flows", () => {
        service.accountDatasetsWithFlows(ACCOUNT_NAME).subscribe((list: AccountListDatasetsWithFlowsQuery) => {
            expect(list.accounts.byName?.flows?.runs.listDatasetsWithFlow.nodes).toEqual(
                mockAccountListDatasetsWithFlowsQuery.accounts.byName?.flows?.runs.listDatasetsWithFlow.nodes,
            );
        });

        const op = controller.expectOne(AccountListDatasetsWithFlowsDocument);
        expect(op.operation.variables.name).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountListDatasetsWithFlowsQuery,
        });
    });

    it("should check account flows paused", () => {
        service.accountFlowsPaused(ACCOUNT_NAME).subscribe((state: AccountDatasetFlowsPausedQuery) => {
            expect(state.accounts.byName?.flows?.triggers.allPaused).toEqual(
                mockAccountDatasetFlowsPausedQuery.accounts.byName?.flows?.triggers.allPaused,
            );
        });

        const op = controller.expectOne(AccountDatasetFlowsPausedDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountDatasetFlowsPausedQuery,
        });
    });

    it("should check account pause flows", () => {
        service.accountPauseFlows(ACCOUNT_NAME).subscribe((state: AccountPauseFlowsMutation) => {
            expect(state.accounts.byName?.flows.triggers.pauseAccountDatasetFlows).toEqual(
                mockAccountPauseFlowsMutationSuccess.accounts.byName?.flows.triggers.pauseAccountDatasetFlows,
            );
        });

        const op = controller.expectOne(AccountPauseFlowsDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountPauseFlowsMutationSuccess,
        });
    });

    it("should check account resume flows", () => {
        service.accountResumeFlows(ACCOUNT_NAME).subscribe((state: AccountResumeFlowsMutation) => {
            expect(state.accounts.byName?.flows.triggers.resumeAccountDatasetFlows).toEqual(
                mockAccountResumeFlowsMutationSuccess.accounts.byName?.flows.triggers.resumeAccountDatasetFlows,
            );
        });

        const op = controller.expectOne(AccountResumeFlowsDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountResumeFlowsMutationSuccess,
        });
    });

    it("should check change account email", () => {
        service
            .changeAccountEmail({ accountName: ACCOUNT_NAME, newEmail: TEST_ACCOUNT_EMAIL })
            .subscribe((state: AccountChangeEmailMutation) => {
                expect(state.accounts.byName?.updateEmail.message).toEqual(
                    mockAccountChangeEmailMutationSuccess.accounts.byName?.updateEmail.message,
                );
            });
        const op = controller.expectOne(AccountChangeEmailDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);
        expect(op.operation.variables.newEmail).toEqual(TEST_ACCOUNT_EMAIL);

        op.flush({
            data: mockAccountChangeEmailMutationSuccess,
        });
    });

    it("should check fetch account email", () => {
        service.fetchAccountWithEmail(ACCOUNT_NAME).subscribe((state: AccountWithEmailQuery) => {
            expect(state.accounts.byName?.email).toEqual(mockAccountWithEmailQuery.accounts.byName?.email);
        });
        const op = controller.expectOne(AccountWithEmailDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountWithEmailQuery,
        });
    });

    it("should check delete account by name", () => {
        service.deleteAccountByName(ACCOUNT_NAME).subscribe((state: DeleteAccountByNameMutation) => {
            expect(state.accounts.byName?.delete.message).toEqual(
                mockDeleteAccountByNameMutation.accounts.byName?.delete.message,
            );
        });
        const op = controller.expectOne(DeleteAccountByNameDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockDeleteAccountByNameMutation,
        });
    });

    it("should check rename account username", () => {
        const NEW_NAME_ACCOUNT = "new-name-account";
        service
            .changeAccountUsername({ accountName: ACCOUNT_NAME, newName: NEW_NAME_ACCOUNT })
            .subscribe((state: ChangeAccountUsernameMutation) => {
                expect(state.accounts.byName?.rename.message).toEqual(
                    mockChangeAccountUsernameMutation.accounts.byName?.rename.message,
                );
            });
        const op = controller.expectOne(ChangeAccountUsernameDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);
        expect(op.operation.variables.newName).toEqual(NEW_NAME_ACCOUNT);

        op.flush({
            data: mockChangeAccountUsernameMutation,
        });
    });

    it("should check change password for admin", () => {
        service
            .changeAdminPassword({ accountName: ACCOUNT_NAME, password: NEW_PASSWORD })
            .subscribe((state: ChangeAdminPasswordMutation) => {
                if (state.accounts.byName?.modifyPassword.__typename === "ModifyPasswordSuccess")
                    expect(state.accounts.byName?.modifyPassword.message).toEqual(
                        (mockChangeAdminPasswordMutation.accounts.byName?.modifyPassword as ModifyPasswordSuccess)
                            .message,
                    );
            });
        const op = controller.expectOne(ChangeAdminPasswordDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);
        expect(op.operation.variables.password).toEqual(NEW_PASSWORD);

        op.flush({
            data: mockChangeAdminPasswordMutation,
        });
    });

    it("should check change password for user", () => {
        service
            .changeUserPassword({ accountName: ACCOUNT_NAME, oldPassword: OLD_PASSWORD, newPassword: NEW_PASSWORD })
            .subscribe((state: ChangeUserPasswordMutation) => {
                if (state.accounts.byName?.modifyPasswordWithConfirmation.__typename === "ModifyPasswordSuccess")
                    expect(state.accounts.byName?.modifyPasswordWithConfirmation.message).toEqual(
                        (
                            mockChangeUserPasswordMutation.accounts.byName
                                ?.modifyPasswordWithConfirmation as ModifyPasswordSuccess
                        ).message,
                    );
            });
        const op = controller.expectOne(ChangeUserPasswordDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);
        expect(op.operation.variables.newPassword).toEqual(NEW_PASSWORD);
        expect(op.operation.variables.oldPassword).toEqual(OLD_PASSWORD);

        op.flush({
            data: mockChangeUserPasswordMutation,
        });
    });

    it("should check account flows all cards", () => {
        service
            .fetchAccountFlowsAsCards({
                accountName: ACCOUNT_NAME,
                page: PAGE,
                perPage: PER_PAGE,
                filters: { effectiveStateIn: [] },
                ordering: { direction: OrderingDirection.Asc, field: FlowProcessOrderField.EffectiveState },
            })
            .subscribe((result: AccountFlowsAsCardsQuery) => {
                expect(result.accounts.byName?.flows.processes.allCards.nodes.length).toEqual(
                    mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes.allCards.nodes.length,
                );
                expect(
                    (result.accounts.byName?.flows.processes.allCards.nodes[0] as DatasetFlowProcess).flowType,
                ).toEqual(DatasetFlowType.Ingest);
            });
        const op = controller.expectOne(AccountFlowsAsCardsDocument);
        expect(op.operation.variables.name).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountFlowsAsCardsQuery,
        });
    });

    it("should check account flows primary cards", () => {
        service
            .fetchAccountPrimaryCards({
                accountName: ACCOUNT_NAME,
                page: PAGE,
                perPage: PER_PAGE,
                filters: { effectiveStateIn: [] },
                ordering: { direction: OrderingDirection.Asc, field: FlowProcessOrderField.EffectiveState },
            })
            .subscribe((result: AccountPrimaryCardsQuery) => {
                expect(result.accounts.byName?.flows.processes.primaryCards.nodes.length).toEqual(
                    mockAccountFlowsPrimaryCardsQuery.accounts.byName?.flows.processes.primaryCards.nodes.length,
                );
                expect(
                    (result.accounts.byName?.flows.processes.primaryCards.nodes[0] as DatasetFlowProcess).flowType,
                ).toEqual(DatasetFlowType.Ingest);
            });
        const op = controller.expectOne(AccountPrimaryCardsDocument);
        expect(op.operation.variables.name).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountFlowsPrimaryCardsQuery,
        });
    });

    it("should check account flows webhook cards", () => {
        service
            .fetchAccountWebhookCards({
                accountName: ACCOUNT_NAME,
                page: PAGE,
                perPage: PER_PAGE,
                filters: { effectiveStateIn: [] },
                ordering: { direction: OrderingDirection.Asc, field: FlowProcessOrderField.EffectiveState },
            })
            .subscribe((result: AccountWebhookCardsQuery) => {
                expect(result.accounts.byName?.flows.processes.webhookCards.nodes.length).toEqual(
                    mockAccountFlowsWebhookCardsQuery.accounts.byName?.flows.processes.webhookCards.nodes.length,
                );
            });
        const op = controller.expectOne(AccountWebhookCardsDocument);
        expect(op.operation.variables.name).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountFlowsWebhookCardsQuery,
        });
    });
});
