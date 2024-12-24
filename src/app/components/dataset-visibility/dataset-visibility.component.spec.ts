import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetVisibilityComponent } from "./dataset-visibility.component";
import { mockPublicDatasetVisibility } from "src/app/search/mock.data";

describe("DatasetVisibilityComponent", () => {
    let component: DatasetVisibilityComponent;
    let fixture: ComponentFixture<DatasetVisibilityComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetVisibilityComponent],
        });
        fixture = TestBed.createComponent(DatasetVisibilityComponent);
        component = fixture.componentInstance;
        (component.datasetVisibility = mockPublicDatasetVisibility), fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
