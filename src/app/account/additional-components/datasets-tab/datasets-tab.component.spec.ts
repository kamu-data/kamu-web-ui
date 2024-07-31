import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";
import { DatasetsTabComponent } from "./datasets-tab.component";
import { DatasetListItemComponent } from "src/app/components/dataset-list-item/dataset-list-item.component";
import { NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatDividerModule } from "@angular/material/divider";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("DatasetsTabComponent", () => {
    let component: DatasetsTabComponent;
    let fixture: ComponentFixture<DatasetsTabComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                NgbRatingModule,
                DisplayTimeModule,
                MatChipsModule,
                NgbPopoverModule,
                MatDividerModule,
                SharedTestModule,
            ],
            providers: [DatasetApi],
            declarations: [DatasetsTabComponent, DatasetListItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasets = [mockDatasetListItem];
        component.accountName = mockAccountDetails.accountName;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #selectDataset with datasets item", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectDataset(mockDatasetListItem);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: mockDatasetListItem.owner.accountName,
            datasetName: mockDatasetListItem.name,
        });
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(testPageNumber);

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            mockAccountDetails.accountName,
            AccountTabs.DATASETS,
            testPageNumber,
        );
    });

    it("should check page changed without current page", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockAccountDetails.accountName, AccountTabs.DATASETS);
    });
});
