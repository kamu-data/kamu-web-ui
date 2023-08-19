import { DatasetApi } from "src/app/api/dataset.api";
import { TestBed } from "@angular/core/testing";

import { AccountService } from "./account.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "../api/account.api";
import { TEST_LOGIN, mockAccountDetails } from "../api/mock/auth.mock";
import { first, of } from "rxjs";
import { MaybeNull } from "../common/app.types";
import { AccountFragment } from "../api/kamu.graphql.interface";

describe("AccountService", () => {
    let service: AccountService;
    let accountApi: AccountApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [DatasetApi],
        });
        service = TestBed.inject(AccountService);
        accountApi = TestBed.inject(AccountApi);
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
});
