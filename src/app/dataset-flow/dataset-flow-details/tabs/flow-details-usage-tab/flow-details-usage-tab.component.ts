/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-flow-details-usage-tab",
    templateUrl: "./flow-details-usage-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FlowDetailsUsageTabComponent {}
