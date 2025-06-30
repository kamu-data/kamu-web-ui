/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form.component";
import { RouterTestingModule } from "@angular/router/testing";
import { TimeDeltaFormModule } from "src/app/common/components/time-delta-form/time-delta-form.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

describe("FlowRetryPolicyFormComponent", () => {
    let component: FlowRetryPolicyFormComponent;
    let fixture: ComponentFixture<FlowRetryPolicyFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FlowRetryPolicyFormComponent],
            imports: [
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                MatSlideToggleModule,
                TimeDeltaFormModule,
                TooltipIconModule,
                FormValidationErrorsModule,
            ],
        });
        fixture = TestBed.createComponent(FlowRetryPolicyFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
