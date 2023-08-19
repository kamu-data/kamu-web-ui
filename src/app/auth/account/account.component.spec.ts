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
import { BehaviorSubject, of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockDatasetsAccountResponse } from "src/app/api/mock/dataset.mock";
import { AccountService } from "src/app/services/account.service";
import ProjectLinks from "src/app/project-links";
import { AccountPageParams } from "./account.component.model";
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

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let navigationService: NavigationService;
    let accountService: AccountService;
    let loggedUserService: LoggedUserService;

    const mockQueryParams: BehaviorSubject<AccountPageParams> = new BehaviorSubject<AccountPageParams>({
        tab: AccountTabs.OVERVIEW,
        page: 2,
    });

    const mockParams = new BehaviorSubject({
        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName,
    });

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

    it("should check API calls when account is found", fakeAsync(() => {
        const fetchAccountByNameSpy = spyOn(accountService, "fetchAccountByName").and.returnValue(
            of(mockAccountDetails),
        );
        const getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName").and.returnValue(
            of(mockDatasetsAccountResponse),
        );

        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: mockAccountDetails.accountName });
        fixture.detectChanges();

        tick();

        expect(fetchAccountByNameSpy).toHaveBeenCalledOnceWith(mockAccountDetails.accountName);
        expect(getDatasetsByAccountNameSpy).toHaveBeenCalledOnceWith(
            mockAccountDetails.accountName,
            jasmine.any(Number),
        );

        flush();
    }));

    it("should check API calls when account is not found", fakeAsync(() => {
        const fetchAccountByNameSpy = spyOn(accountService, "fetchAccountByName").and.returnValue(of(null));
        const getDatasetsByAccountNameSpy = spyOn(accountService, "getDatasetsByAccountName").and.stub();

        mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_LOGIN });
        fixture.detectChanges();

        expect(() => tick()).toThrow(new AccountNotFoundError());

        expect(fetchAccountByNameSpy).toHaveBeenCalledOnceWith(TEST_LOGIN);
        expect(getDatasetsByAccountNameSpy).not.toHaveBeenCalled();

        flush();
    }));

    it("should check activeTab when URL not exist query param tab", () => {
        mockQueryParams.next({ tab: "" as AccountTabs, page: 1 });
        expect(component.activeTab).toEqual(AccountTabs.OVERVIEW);
    });

    Object.values(AccountTabs).forEach((tab: string) => {
        it(`should check switch ${tab} tab`, fakeAsync(() => {
            spyOn(accountService, "fetchAccountByName").and.returnValue(of(mockAccountDetails));
            spyOn(accountService, "getDatasetsByAccountName").and.returnValue(of(mockDatasetsAccountResponse));

            const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");

            mockParams.next({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_LOGIN });

            tick();
            fixture.detectChanges();

            emitClickOnElementByDataTestId(fixture, `account-${tab}-tab`);

            expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockAccountDetails.accountName, tab);
            flush();
        }));
    });

    // TODO: test wrong tab

    it("should check page when not specified in the querty", () => {
        mockQueryParams.next({ tab: AccountTabs.DATASETS });

        expect(component.activeTab).toEqual(AccountTabs.DATASETS);
        expect(component.currentPage).toEqual(1);
    });
});
