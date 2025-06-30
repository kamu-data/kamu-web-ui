/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StepperNavigationComponent } from "./stepper-navigation.component";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { SetPollingSourceSection } from "../source-events/add-polling-source/add-polling-source-form.types";

describe("StepperNavigationComponent", () => {
    let component: StepperNavigationComponent;
    let fixture: ComponentFixture<StepperNavigationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StepperNavigationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StepperNavigationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check next button is working", () => {
        const changeStepEmitterSpy = spyOn(component.changeStepEmitter, "emit").and.callThrough();
        component.prevStep = null;
        component.validStep = true;
        component.nextStep = SetPollingSourceSection.READ;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "next-button");
        expect(changeStepEmitterSpy).toHaveBeenCalledWith(SetPollingSourceSection.READ);
    });

    it("should check save button is working", () => {
        const changeStepEmitterSpy = spyOn(component.saveEventEmitter, "emit").and.callThrough();
        component.prevStep = SetPollingSourceSection.READ;
        component.validStep = true;
        component.nextStep = null;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "save-button");
        expect(changeStepEmitterSpy).toHaveBeenCalledWith();
    });

    it("should check edit button is working", () => {
        const changeStepEmitterSpy = spyOn(component.editYamlEmitter, "emit").and.callThrough();
        component.prevStep = SetPollingSourceSection.READ;
        component.validStep = true;
        component.nextStep = null;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "edit-button");
        expect(changeStepEmitterSpy).toHaveBeenCalledWith();
    });
});
