/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TooltipIconComponent } from "../tooltip-icon/tooltip-icon.component";
import { NgClass } from "@angular/common";

@Component({
    selector: "app-block-row-data",
    templateUrl: "./block-row-data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TooltipIconComponent, NgClass],
})
export class BlockRowDataComponent {
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
    @Input() public rowClass: string;
}
