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
    AccountFragment,
    AccountListDatasetsWithFlowsDocument,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsDocument,
    AccountListFlowsQuery,
    AccountPauseFlowsDocument,
    AccountPauseFlowsMutation,
    AccountResumeFlowsDocument,
    AccountResumeFlowsMutation,
    AccountWithEmailDocument,
    AccountWithEmailQuery,
    FlowConnectionDataFragment,
} from "./kamu.graphql.interface";
import { TEST_ACCOUNT_EMAIL, TEST_LOGIN, mockAccountDetails } from "./mock/auth.mock";
import { first } from "rxjs";
import { MaybeNull } from "../interface/app.types";
import {
    mockAccountByNameNotFoundResponse,
    mockAccountByNameResponse,
    mockAccountChangeEmailMutationSuccess,
    mockAccountDatasetFlowsPausedQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockAccountPauseFlowsMutationSuccess,
    mockAccountResumeFlowsMutationSuccess,
    mockAccountWithEmailQuery,
} from "./mock/account.mock";

describe("AccountApi", () => {
    let service: AccountApi;
    let controller: ApolloTestingController;
    const ACCOUNT_NAME = "accountName";
    const PAGE = 1;
    const PER_PAGE = 15;
    const ACCOUNT_FILTERS: AccountFlowFilters = {
        byDatasetIds: [],
        byFlowType: null,
        byInitiator: null,
        byStatus: null,
    };

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
});
