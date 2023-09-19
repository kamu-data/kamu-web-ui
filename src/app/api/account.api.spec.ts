import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "./account.api";
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AccountByNameDocument, AccountByNameQuery, AccountFragment } from "./kamu.graphql.interface";
import { TEST_LOGIN, mockAccountDetails } from "./mock/auth.mock";
import { first } from "rxjs";
import { MaybeNull } from "../common/app.types";
import { mockAccountByNameNotFoundResponse, mockAccountByNameResponse } from "./mock/account.mock";

describe("AccountApi", () => {
    let service: AccountApi;
    let controller: ApolloTestingController;

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
});
