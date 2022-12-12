import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TEST_BLOCK_HASH } from "src/app/api/mock/dataset.mock";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DisplayHashComponent } from "./display-hash.component";

describe("DisplayHashComponent", () => {
    let component: DisplayHashComponent;
    let fixture: ComponentFixture<DisplayHashComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayHashComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayHashComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to metadata block page", () => {
        component.value = TEST_BLOCK_HASH;
        component.datasetInfo = mockDatasetInfo;

        fixture.detectChanges();

        const navigateToMetadataBlockSpy = spyOn(
            navigationService,
            "navigateToMetadataBlock",
        );
        component.navigateToMetadataBlock(
            mockDatasetInfo.accountName,
            mockDatasetInfo.datasetName,
            TEST_BLOCK_HASH,
        );
        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetInfo.datasetName,
            accountName: mockDatasetInfo.accountName,
            blockHash: TEST_BLOCK_HASH,
        });
    });
});
