/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestTriggerFormComponent } from "./ingest-trigger-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TooltipIconModule } from "src/app/common/components/tooltip-icon/tooltip-icon.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TimeDeltaFormModule } from "src/app/common/components/time-delta-form/time-delta-form.module";
import { CronExpressionFormModule } from "src/app/common/components/cron-expression-form/cron-expression-form.module";

@NgModule({
    declarations: [IngestTriggerFormComponent],
    exports: [IngestTriggerFormComponent],

    imports: [
        CommonModule,
        FormsModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        MatRadioModule,
        ReactiveFormsModule,
        TooltipIconModule,
        TimeDeltaFormModule,
        CronExpressionFormModule,
    ],
})
export class IngestTriggerModule {}
