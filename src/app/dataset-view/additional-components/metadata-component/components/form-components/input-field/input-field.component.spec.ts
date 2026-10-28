/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { dispatchInputEvent, getElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import AppValues from "@common/values/app.values";

import { InputFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.component";

describe("InputFieldComponent", () => {
    let component: InputFieldComponent;
    let fixture: ComponentFixture<InputFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, InputFieldComponent, FormValidationErrorsDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;

        setComponentInput(
            fixture,
            "form",
            new FormGroup({
                test: new FormControl("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN)]),
            }),
        );
        setComponentInput(fixture, "controlName", "test");
        setComponentInput(fixture, "dataTestId", "input");
        setComponentInput(fixture, "label", "Input");
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check required validation error", () => {
        fixture.detectChanges();
        dispatchInputEvent(fixture, "input", "");

        const requiredMessage = getElementByDataTestId(fixture, "error-message");
        expect(requiredMessage.textContent?.trim()).toBe("Input is required");
    });

    it("should check maxLength validation error", () => {
        setComponentInput(
            fixture,
            "form",
            new FormGroup({
                test: new FormControl("", [Validators.maxLength(1)]),
            }),
        );
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const maxLengthMessage = getElementByDataTestId(fixture, "error-message");
        expect(maxLengthMessage.textContent?.trim()).toBe("Input can't exceed 1 characters");
    });

    it("should check pattern validation error", () => {
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const patternMessage = getElementByDataTestId(fixture, "error-message");
        expect(patternMessage.textContent?.trim()).toBe("Input has the wrong format");
    });
});
