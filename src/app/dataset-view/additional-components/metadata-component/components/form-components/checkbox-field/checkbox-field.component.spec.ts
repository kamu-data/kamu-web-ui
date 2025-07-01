/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CheckboxFieldComponent } from "./checkbox-field.component";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { getInputElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("CheckboxFieldComponent", () => {
    let component: CheckboxFieldComponent;
    let fixture: ComponentFixture<CheckboxFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                NgbTooltipModule,
                SharedTestModule,
                CheckboxFieldComponent,
                TooltipIconComponent,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckboxFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ test: new FormControl(false) });
        component.controlName = "test";
        component.tooltip = "Test tooltip";
        component.dataTestId = "checkbox";
        component.checked = false;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check state control", () => {
        const element = getInputElementByDataTestId(fixture, "checkbox");
        expect(element.checked).toBe(false);
        expect(component.form.controls.test.value).toBe(false);

        element.click();

        expect(element.checked).toBe(true);
        expect(component.form.controls.test.value).toBe(true);
    });
});
