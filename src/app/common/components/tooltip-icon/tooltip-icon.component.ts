/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "src/app/common/values/app.values";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-tooltip-icon",
    templateUrl: "./tooltip-icon.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, NgbTooltip],
})
export class TooltipIconComponent {
    @Input({ required: true }) public tooltip: string;
    public readonly OPEN_DELAY: number = AppValues.SHORT_DELAY_MS;
}
