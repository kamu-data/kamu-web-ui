/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockRowDataComponent } from "./block-row-data.component";
import { TooltipIconModule } from "../tooltip-icon/tooltip-icon.module";

@NgModule({
    declarations: [BlockRowDataComponent],
    exports: [BlockRowDataComponent],
    imports: [CommonModule, TooltipIconModule],
})
export class BlockRowDataModule {}
