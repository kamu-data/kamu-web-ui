/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-data-access-export-tab",
    templateUrl: "./data-access-export-tab.component.html",
    styleUrls: ["./data-access-export-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatIconModule],
})
export class DataAccessExportTabComponent {}
