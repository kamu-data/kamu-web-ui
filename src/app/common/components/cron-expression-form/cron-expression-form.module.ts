/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CronExpressionFormComponent } from "./cron-expression-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [CronExpressionFormComponent],
    exports: [CronExpressionFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CronExpressionFormModule {}
