import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetVisibilityComponent } from "./dataset-visibility.component";
import { mockPrivateDatasetVisibility, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";

describe("DatasetVisibilityComponent", () => {
    let component: DatasetVisibilityComponent;
    let fixture: ComponentFixture<DatasetVisibilityComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetVisibilityComponent],
        });
        fixture = TestBed.createComponent(DatasetVisibilityComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check dataset visibility is public", () => {
        component.datasetVisibility = mockPublicDatasetVisibility;
        fixture.detectChanges();
        const badgeElemnet = findElementByDataTestId(fixture, "dataset-visibility") as HTMLSpanElement;
        expect(badgeElemnet.textContent?.trim()).toEqual("Public");
    });

    it("should check dataset visibility is private", () => {
        component.datasetVisibility = mockPrivateDatasetVisibility;
        fixture.detectChanges();
        const badgeElemnet = findElementByDataTestId(fixture, "dataset-visibility") as HTMLSpanElement;
        expect(badgeElemnet.textContent?.trim()).toEqual("Private");
    });
});
