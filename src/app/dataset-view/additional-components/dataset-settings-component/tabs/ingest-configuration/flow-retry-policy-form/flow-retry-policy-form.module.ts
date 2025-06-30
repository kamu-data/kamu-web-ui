/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TimeDeltaFormModule } from "../../../../../../common/components/time-delta-form/time-delta-form.module";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

@NgModule({
    declarations: [FlowRetryPolicyFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        TooltipIconModule,
        TimeDeltaFormModule,
        FormValidationErrorsModule,
    ],
    exports: [FlowRetryPolicyFormComponent],
})
export class FlowRetryPolicyFormModule {}
