import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "./account.api";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    AccountByNameDocument,
    AccountByNameQuery,
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
    FlowConnectionDataFragment,
} from "./kamu.graphql.interface";
import { TEST_LOGIN, mockAccountDetails } from "./mock/auth.mock";
import { first } from "rxjs";
import { MaybeNull } from "../common/app.types";
import {
    mockAccountByNameNotFoundResponse,
    mockAccountByNameResponse,
    mockAccountDatasetFlowsPausedQuery,
    mockAccountListDatasetsWithFlowsQuery,
    mockAccountListFlowsQuery,
    mockAccountPauseFlowsMutationSuccess,
    mockAccountResumeFlowsMutationSuccess,
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
            expect(state.accounts.byName?.flows?.configs.allPaused).toEqual(
                mockAccountDatasetFlowsPausedQuery.accounts.byName?.flows?.configs.allPaused,
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
            expect(state.accounts.byName?.flows.configs.pauseAccountDatasetFlows).toEqual(
                mockAccountPauseFlowsMutationSuccess.accounts.byName?.flows.configs.pauseAccountDatasetFlows,
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
            expect(state.accounts.byName?.flows.configs.resumeAccountDatasetFlows).toEqual(
                mockAccountResumeFlowsMutationSuccess.accounts.byName?.flows.configs.resumeAccountDatasetFlows,
            );
        });

        const op = controller.expectOne(AccountResumeFlowsDocument);
        expect(op.operation.variables.accountName).toEqual(ACCOUNT_NAME);

        op.flush({
            data: mockAccountResumeFlowsMutationSuccess,
        });
    });
});
