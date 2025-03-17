/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BatchingTriggerFormComponent } from "./batching-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
    declarations: [BatchingTriggerFormComponent],
    exports: [BatchingTriggerFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        TooltipIconModule,
    ],
})
export class BatchingTriggerModule {}
