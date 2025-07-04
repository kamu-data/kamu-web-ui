/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InputFieldComponent } from "./input-field.component";
import { dispatchInputEvent, getInputElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { ChangeDetectionStrategy } from "@angular/core";
import AppValues from "src/app/common/values/app.values";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("InputFieldComponent", () => {
    let component: InputFieldComponent;
    let fixture: ComponentFixture<InputFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, InputFieldComponent],
        })
            .overrideComponent(InputFieldComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;

        component.form = new FormGroup({
            test: new FormControl("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN)]),
        });
        component.controlName = "test";
        component.dataTestId = "input";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check required validation error", () => {
        fixture.detectChanges();
        dispatchInputEvent(fixture, "input", "");

        const requiredMessage = getInputElementByDataTestId(fixture, "error-test-required");
        expect(requiredMessage.textContent?.trim()).toBe("Field is required");
    });

    it("should check maxLength validation error", () => {
        component.form = new FormGroup({
            test: new FormControl("", [Validators.maxLength(1)]),
        });
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const maxLengthMessage = getInputElementByDataTestId(fixture, "error-test-maxLength");
        expect(maxLengthMessage.textContent?.trim()).toBe("Field can be max 1 character");
    });

    it("should check pattern validation error", () => {
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const patternMessage = getInputElementByDataTestId(fixture, "error-test-pattern");
        expect(patternMessage.textContent?.trim()).toBe("Field format is wrong");
    });
});
