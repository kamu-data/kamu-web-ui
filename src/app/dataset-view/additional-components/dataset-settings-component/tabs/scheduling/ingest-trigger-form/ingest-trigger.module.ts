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
    ],
})
export class IngestTriggerModule {}
