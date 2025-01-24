import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VisibilityPropertyComponent } from "./visibility-property.component";

describe("VisibilityPropertyComponent", () => {
    let component: VisibilityPropertyComponent;
    let fixture: ComponentFixture<VisibilityPropertyComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VisibilityPropertyComponent],
        });
        fixture = TestBed.createComponent(VisibilityPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
