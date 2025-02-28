/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipIconComponent } from "./tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [TooltipIconComponent],
    exports: [TooltipIconComponent],
    imports: [CommonModule, MatIconModule, NgbTooltipModule],
})
export class TooltipIconModule {}
