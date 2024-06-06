import { DatasetApi } from "src/app/api/dataset.api";
import { TestBed } from "@angular/core/testing";
import { AccountService } from "./account.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AccountApi } from "../api/account.api";
import { TEST_LOGIN, TEST_PAGE_NUMBER, mockAccountDetails } from "../api/mock/auth.mock";
import { first, of } from "rxjs";
import { MaybeNull } from "../common/app.types";
import { AccountFragment } from "../api/kamu.graphql.interface";
import { mockDatasetsByAccountNameQuery } from "../api/mock/dataset.mock";
import { DatasetsAccountResponse } from "../interface/dataset.interface";
import { ToastrModule } from "ngx-toastr";

describe("AccountService", () => {
    let service: AccountService;
    let accountApi: AccountApi;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        });
        service = TestBed.inject(AccountService);
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

    // mockDatasetsAccountResponse
});
