/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";

import { NumberFieldComponent } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.component";

import { SharedTestModule } from "@common/modules/shared-test.module";

describe("NumberFieldComponent", () => {
    let component: NumberFieldComponent;
    let fixture: ComponentFixture<NumberFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, NumberFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NumberFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            port: new FormControl(""),
        });
        component.controlName = "port";
        component.dataTestId = "port";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
