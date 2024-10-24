import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InputDataSectionComponent } from "./input-data-section.component";

describe("InputDataSectionComponent", () => {
    let component: InputDataSectionComponent;
    let fixture: ComponentFixture<InputDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [InputDataSectionComponent],
        });
        fixture = TestBed.createComponent(InputDataSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
