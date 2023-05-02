import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ToggleComponent } from "./toggle.component";

describe("ToggleComponent", () => {
    let component: ToggleComponent;
    let fixture: ComponentFixture<ToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToggleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check on toggle state", () => {
        component.isToggled = false;
        const expectedValue = true;
        const toggledSpy = spyOn(component.toggled, "emit");

        emitClickOnElementByDataTestId(fixture, "toggle-button");

        expect(component.isToggled).toBeTrue();
        expect(toggledSpy).toHaveBeenCalledWith(expectedValue);
    });
});
