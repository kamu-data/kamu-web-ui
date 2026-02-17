/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import AppValues from "@common/values/app.values";

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
