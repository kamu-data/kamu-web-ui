import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";

import { DatasetsTabComponent } from "./datasets-tab.component";

describe("DatasetsTabComponent", () => {
    let component: DatasetsTabComponent;
    let fixture: ComponentFixture<DatasetsTabComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [DatasetApi],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [DatasetsTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasets = [mockDatasetListItem];
        component.accountName = mockAccountDetails.login;
        component.accountViewType = AccountTabs.overview;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #selectDataset with datasets item", () => {
        const navigateToDatasetViewSpy = spyOn(
            navigationService,
            "navigateToDatasetView",
        );
        component.onSelectDataset(mockDatasetListItem);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetListItem.owner.name,
            datasetName: mockDatasetListItem.name as string,
        });
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        component.accountViewType = AccountTabs.datasets;
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
        component.accountViewType = AccountTabs.datasets;
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        component.onPageChange({});
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            mockAccountDetails.login,
            AccountTabs.datasets,
        );
    });
});