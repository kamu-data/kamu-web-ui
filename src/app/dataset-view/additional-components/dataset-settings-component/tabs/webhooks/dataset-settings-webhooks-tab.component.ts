/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-dataset-settings-webhooks-tab",
    templateUrl: "./dataset-settings-webhooks-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        RouterOutlet,
        //-----//
        MatDividerModule,
        MatIconModule,
        MatTableModule,
    ],
})
export class DatasetSettingsWebhooksTabComponent {}
