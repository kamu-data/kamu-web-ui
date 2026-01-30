/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AccountTabComponent } from "../../settings/tabs/account-tab/account-tab.component";

@Component({
    selector: "app-settings-tab",
    templateUrl: "./settings-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AccountTabComponent],
})
export class SettingsTabComponent {}
