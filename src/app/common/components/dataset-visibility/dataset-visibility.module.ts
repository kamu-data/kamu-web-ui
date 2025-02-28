/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetVisibilityComponent } from "./dataset-visibility.component";

@NgModule({
    declarations: [DatasetVisibilityComponent],
    exports: [DatasetVisibilityComponent],
    imports: [CommonModule],
})
export class DatasetVisibilityModule {}
