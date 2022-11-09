import { User } from "./../../api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { mockAccountDetails } from "./../../api/mock/auth.mock";
import { AccountTabs } from "./account.constants";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import {
    emitClickOnElement,
    routerMock,
} from "src/app/common/base-test.helpers.spec";

import { AccountComponent } from "./account.component";
import { BehaviorSubject } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";

describe("AccountComponent", () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let navigationService: NavigationService;
    const mockQueryParams = new BehaviorSubject({
        tab: AccountTabs.overview,
        page: 2,
    });
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountComponent],
            imports: [
                ApolloTestingModule,
                MatIconModule,
                MatButtonToggleModule,
            ],
            providers: [
                DatasetApi,
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: mockQueryParams.asObservable(),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountComponent);
        navigationService = TestBed.inject(NavigationService);
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
            const navigateToOwnerViewSpy = spyOn(
                navigationService,
                "navigateToOwnerView",
            );
            emitClickOnElement(fixture, `[data-test-id="account-${tab}-tab"]`);
            expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
                mockAccountDetails.login,
                tab,
            );
        });
    });

    it("should check #selectDataset with datasets item", () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.onSelectDataset(mockDatasetListItem);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: (mockDatasetListItem.owner as User).name,
            datasetName: mockDatasetListItem.name as string,
        });
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        mockQueryParams.next({ tab: AccountTabs.datasets, page: 1 });
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        component.onPageChange({ currentPage: testPageNumber, isClick: false });
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            mockAccountDetails.login,
            AccountTabs.datasets,
            testPageNumber,
        );
    });

    it("should check page changed without cuurrent page", () => {
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        component.onPageChange({});
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            mockAccountDetails.login,
            AccountTabs.overview,
        );
    });
});
