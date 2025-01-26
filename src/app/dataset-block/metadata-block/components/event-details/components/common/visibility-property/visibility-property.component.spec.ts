import { SharedTestModule } from "src/app/common/shared-test.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VisibilityPropertyComponent } from "./visibility-property.component";
import { mockPublicDatasetVisibility } from "src/app/search/mock.data";

describe("VisibilityPropertyComponent", () => {
    let component: VisibilityPropertyComponent;
    let fixture: ComponentFixture<VisibilityPropertyComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisibilityPropertyComponent],
            imports: [SharedTestModule],
        });
        fixture = TestBed.createComponent(VisibilityPropertyComponent);
        component = fixture.componentInstance;
        component.data = mockPublicDatasetVisibility;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
