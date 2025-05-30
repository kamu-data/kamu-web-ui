/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { FormValidationErrorsDirective } from "./form-validation-errors.directive";

@NgModule({
    declarations: [FormValidationErrorsDirective],
    exports: [FormValidationErrorsDirective],
    imports: [CommonModule, ReactiveFormsModule],
})
export class FormValidationErrorsModule {}
