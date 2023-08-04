import { NavigationService } from "src/app/services/navigation.service";
import { mockAccountDetails } from "./../../api/mock/auth.mock";
import { AccountTabs } from "./account.constants";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { emitClickOnElementByDataTestId, routerMock } from "src/app/common/base-test.helpers.spec";

import { AccountComponent } from "./account.component";
import { BehaviorSubject } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockDatasetsAccountResponse } from "src/app/api/mock/dataset.mock";
import { AccountService } from "src/app/services/account.service";
import ProjectLinks from "src/app/project-links";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let navigationService: NavigationService;
    let accountService: AccountService;
    const mockQueryParams = new BehaviorSubject({
        tab: AccountTabs.overview,
        page: 2,
    });
    const mockParams = new BehaviorSubject({
        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: "test-user",
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountComponent],
            imports: [ApolloTestingModule, MatIconModule, MatButtonToggleModule],
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

        fixture = TestBed.createComponent(AccountComponent);
        navigationService = TestBed.inject(NavigationService);
        accountService = TestBed.inject(AccountService);
        accountService.datasetsChanges(mockDatasetsAccountResponse);
        component = fixture.componentInstance;
        component.user = mockAccountDetails;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check accountViewType when URL not exist query param tab", () => {
        mockQueryParams.next({ tab: "" as AccountTabs, page: 1 });
        expect(component.accountViewType).toEqual(AccountTabs.overview);
    });

    Object.values(AccountTabs).forEach((tab: string) => {
        it(`should check switch ${tab} tab`, () => {
            const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
            emitClickOnElementByDataTestId(fixture, `account-${tab}-tab`);
            expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockAccountDetails.login, tab);
        });
    });

    it("should check get data from accountService subscription", () => {
        accountService.datasetsChanges(mockDatasetsAccountResponse);
        component.ngOnInit();
        expect(component.datasets).toEqual(mockDatasetsAccountResponse.datasets);
        expect(component.pageInfo).toEqual(mockDatasetsAccountResponse.pageInfo);
        expect(component.datasetTotalCount).toEqual(mockDatasetsAccountResponse.datasetTotalCount);
    });
});
