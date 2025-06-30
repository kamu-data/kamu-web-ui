/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimeDeltaFormComponent } from "./time-delta-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [TimeDeltaFormComponent],
    exports: [TimeDeltaFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TimeDeltaFormModule {}
