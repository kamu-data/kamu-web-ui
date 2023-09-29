import { NavigationService } from "src/app/services/navigation.service";
import { TEST_AVATAR_URL, TEST_LOGIN, mockAccountDetails } from "../../api/mock/auth.mock";
import { AccountTabs } from "./account.constants";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { emitClickOnElementByDataTestId, routerMock } from "src/app/common/base-test.helpers.spec";
import { AccountComponent } from "./account.component";
import { BehaviorSubject, delay, of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockDatasetsAccountResponse } from "src/app/api/mock/dataset.mock";
import { AccountService } from "src/app/services/account.service";
import ProjectLinks from "src/app/project-links";
import { AccountPageQueryParams } from "./account.component.model";
import { DatasetsTabComponent } from "./additional-components/datasets-tab/datasets-tab.component";
import AppValues from "src/app/common/app.values";
import { DatasetListItemComponent } from "src/app/components/dataset-list-item/dataset-list-item.component";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { NgbPaginationModule, NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { LoggedUserService } from "../logged-user.service";
import { DisplayTimeComponent } from "src/app/components/display-time/display-time.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { AccountNotFoundError } from "src/app/common/errors";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let navigationService: NavigationService;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;

    const mockQueryParams: BehaviorSubject<AccountPageQueryParams> = new BehaviorSubject<AccountPageQueryParams>({
        tab: AccountTabs.INBOX,
    });

    const mockParams = new BehaviorSubject({
        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName,
    });

    let fetchAccountByNameSpy: jasmine.Spy;
    let getDatasetsByAccountNameSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AccountComponent,
                DatasetsTabComponent,
                DatasetListItemComponent,
                PaginationComponent,
                DisplayTimeComponent,
            ],
            imports: [
                ApolloTestingModule,
                MatIconModule,
                MatButtonToggleModule,
                MatChipsModule,
                MatDividerModule,
                NgbPaginationModule,
                NgbPopoverModule,
                NgbRatingModule,
                HttpClientTestingModule,
            ],
            providers: [
                DatasetApi,
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: mockQueryParams.asObservable(),
                        params: mockParams.asObservable(),
                    },
                },
            ],
        }).compileComponents();

        navigationService = TestBed.inject(NavigationService);
        accountService = TestBed.inject(AccountService);

        fetchAccountByNameSpy = spyOn(accountService, "fetchAccountByName").and.returnValue(of(mockAccountDetails));
        getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName").and.returnValue(
            of(mockDatasetsAccountResponse),
        );

        loggedUserService = TestBed.inject(LoggedUserService);
        spyOnProperty(loggedUserService, "onLoggedInUserChanges", "get").and.returnValue(of(null));

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check avatar link propagation vs default", () => {
        expect(component.avatarLink(mockAccountDetails)).toEqual(TEST_AVATAR_URL);

        expect(
            component.avatarLink({
                ...mockAccountDetails,
                avatarUrl: undefined,
            }),
        ).toEqual(AppValues.DEFAULT_AVATAR_URL);
    });

    it("should check isLoggedUser property", () => {
        expect(component.isLoggedUser(mockAccountDetails)).toEqual(false);

        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName });

        expect(component.isLoggedUser(mockAccountDetails)).toEqual(true);
    });

    it("should check API calls when account is found", () => {
        fetchAccountByNameSpy.calls.reset();
        getDatasetsByAccountNameSpy.calls.reset();

        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName });

        expect(fetchAccountByNameSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(
            mockAccountDetails.accountName,
            jasmine.any(Number),
        );
    });

    it("should check API calls when account is not found", fakeAsync(() => {
        fetchAccountByNameSpy = fetchAccountByNameSpy.and.returnValue(of(null).pipe(delay(0)));
        getDatasetsByAccountNameSpy = getDatasetsByAccountNameSpy.and.stub();
        fetchAccountByNameSpy.calls.reset();
        getDatasetsByAccountNameSpy.calls.reset();

        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_LOGIN });

        expect(fetchAccountByNameSpy).toHaveBeenCalledOnceWith(TEST_LOGIN);
        expect(getDatasetsByAccountNameSpy).not.toHaveBeenCalled();

        expect(() => tick()).toThrow(new AccountNotFoundError());
        expect(() => flush()).toThrow(new AccountNotFoundError());
    }));

    it("should check activeTab when URL not exist query param tab", () => {
        mockQueryParams.next({ page: 1 });

        let nCalls = 0;
        component.activeTab$.subscribe((activeTab: AccountTabs) => {
            // Ignore first call (default event)
            if (nCalls == 1) {
                expect(activeTab).toEqual(AccountTabs.OVERVIEW);
            } else if (nCalls > 2) {
                fail("Unexpected number of calls");
            }
            nCalls++;
        });

        expect(nCalls).toEqual(2);
    });

    Object.values(AccountTabs).forEach((tab: string) => {
        it(`should check switch ${tab} tab`, () => {
            const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");

            mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_LOGIN });

            emitClickOnElementByDataTestId(fixture, `account-${tab}-tab`);

            expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockAccountDetails.accountName, tab);
        });
    });

    // TODO: test wrong tab

    it("should check page when not specified in the query", () => {
        getDatasetsByAccountNameSpy.calls.reset();

        mockQueryParams.next({ tab: AccountTabs.DATASETS });

        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName, 0);
    });

    it("should check page when specified in the query", () => {
        getDatasetsByAccountNameSpy.calls.reset();

        mockQueryParams.next({ tab: AccountTabs.DATASETS, page: 3 });

        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName, 2 /* 3 - 1 */);
    });
});
