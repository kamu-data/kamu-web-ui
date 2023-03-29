import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckboxFieldComponent } from "./checkbox-field.component";

describe("CheckboxFieldComponent", () => {
    let component: CheckboxFieldComponent;
    let fixture: ComponentFixture<CheckboxFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CheckboxFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckboxFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
