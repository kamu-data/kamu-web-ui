import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StepperNavigationComponent } from "./stepper-navigation.component";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { emitClickOnElement } from "src/app/common/base-test.helpers.spec";

describe("StepperNavigationComponent", () => {
    let component: StepperNavigationComponent;
    let fixture: ComponentFixture<StepperNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepperNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperNavigationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check next button is working", () => {
        const changeStepEmitterSpy = spyOn(
            component.changeStepEmitter,
            "emit",
        ).and.callThrough();
        component.prevStep = null;
        component.validStep = true;
        component.nextStep = SetPollingSourceSection.READ;
        fixture.detectChanges();
        emitClickOnElement(fixture, '[data-test-id="next-button"]');
        expect(changeStepEmitterSpy).toHaveBeenCalledWith(
            SetPollingSourceSection.READ,
        );
    });

    it("should check save button is working", () => {
        const changeStepEmitterSpy = spyOn(
            component.saveEventEmitter,
            "emit",
        ).and.callThrough();
        component.prevStep = SetPollingSourceSection.READ;
        component.validStep = true;
        component.nextStep = null;
        fixture.detectChanges();
        emitClickOnElement(fixture, '[data-test-id="save-button"]');
        expect(changeStepEmitterSpy).toHaveBeenCalledWith();
    });

    it("should check edit button is working", () => {
        const changeStepEmitterSpy = spyOn(
            component.editYamlEmitter,
            "emit",
        ).and.callThrough();
        component.prevStep = SetPollingSourceSection.READ;
        component.validStep = true;
        component.nextStep = null;
        fixture.detectChanges();
        emitClickOnElement(fixture, '[data-test-id="edit-button"]');
        expect(changeStepEmitterSpy).toHaveBeenCalledWith();
    });
});
