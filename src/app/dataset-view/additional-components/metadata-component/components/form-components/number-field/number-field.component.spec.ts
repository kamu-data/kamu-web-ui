/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NumberFieldComponent } from "./number-field.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("NumberFieldComponent", () => {
    let component: NumberFieldComponent;
    let fixture: ComponentFixture<NumberFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NumberFieldComponent, TooltipIconComponent],
            imports: [SharedTestModule, ReactiveFormsModule, NgbTooltipModule],
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
