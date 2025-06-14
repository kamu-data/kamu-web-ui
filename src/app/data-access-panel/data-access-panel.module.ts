/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataAccessPanelComponent } from "./data-access-panel.component";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DataAccessModalComponent } from "./data-access-modal/data-access-modal.component";
import { DataAccessLinkTabComponent } from "./data-access-modal/tabs/data-access-link-tab/data-access-link-tab.component";
import { DataAccessKamuCliTabComponent } from "./data-access-modal/tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { DataAccessRestTabComponent } from "./data-access-modal/tabs/data-access-rest-tab/data-access-rest-tab.component";
import { DataAccessSqlTabComponent } from "./data-access-modal/tabs/data-access-sql-tab/data-access-sql-tab.component";
import { DataAccessStreamTabComponent } from "./data-access-modal/tabs/data-access-stream-tab/data-access-stream-tab.component";
import { DataAccessCodeTabComponent } from "./data-access-modal/tabs/data-access-code-tab/data-access-code-tab.component";
import { DataAccessOdataTabComponent } from "./data-access-modal/tabs/data-access-odata-tab/data-access-odata-tab.component";
import { DataAccessExportTabComponent } from "./data-access-modal/tabs/data-access-export-tab/data-access-export-tab.component";
import { RouterModule } from "@angular/router";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";
import { CopyToClipboardModule } from "../common/components/copy-to-clipboard/copy-to-clipboard.module";

@NgModule({
    declarations: [
        DataAccessCodeTabComponent,
        DataAccessExportTabComponent,
        DataAccessKamuCliTabComponent,
        DataAccessLinkTabComponent,
        DataAccessModalComponent,
        DataAccessOdataTabComponent,
        DataAccessPanelComponent,
        DataAccessRestTabComponent,
        DataAccessSqlTabComponent,
        DataAccessStreamTabComponent,
    ],
    imports: [
        ClipboardModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatTabsModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterModule,

        CopyToClipboardModule,
        FeatureFlagModule,
    ],
    exports: [DataAccessPanelComponent],
})
export class DataAccessPanelModule {}
