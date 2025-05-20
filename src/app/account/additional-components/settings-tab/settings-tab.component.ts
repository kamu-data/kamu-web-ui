/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-settings-tab",
    templateUrl: "./settings-tab.component.html",
    styleUrls: ["./settings-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabComponent {}
