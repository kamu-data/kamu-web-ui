/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IngestConfigurationFormComponent } from "./ingest-configuration-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
    declarations: [IngestConfigurationFormComponent],
    exports: [IngestConfigurationFormComponent],
    imports: [CommonModule, FormsModule, MatDividerModule, MatCheckboxModule, ReactiveFormsModule],
})
export class IngestConfigurationModule {}
