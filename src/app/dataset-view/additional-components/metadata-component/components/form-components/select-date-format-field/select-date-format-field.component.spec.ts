import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SelectDateFormatFieldComponent } from "./select-date-format-field.component";

describe("SelectDateFormatFieldComponent", () => {
    let component: SelectDateFormatFieldComponent;
    let fixture: ComponentFixture<SelectDateFormatFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectDateFormatFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectDateFormatFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
