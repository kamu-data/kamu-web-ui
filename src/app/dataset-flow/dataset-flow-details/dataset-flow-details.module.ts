/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { DatasetViewModule } from "src/app/dataset-view/dataset-view.module";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { FlowDetailsHistoryTabComponent } from "./tabs/flow-details-history-tab/flow-details-history-tab.component";
import { FlowDetailsSummaryTabComponent } from "./tabs/flow-details-summary-tab/flow-details-summary-tab.component";
import { FlowDetailsLogsTabComponent } from "./tabs/flow-details-logs-tab/flow-details-logs-tab.component";
import { DatasetViewMenuModule } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.module";
import { SafeHtmlModule } from "src/app/common/pipes/safe-html.module";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";

@NgModule({
    declarations: [
        DatasetFlowDetailsComponent,
        FlowDetailsHistoryTabComponent,
        FlowDetailsLogsTabComponent,
        FlowDetailsSummaryTabComponent,
    ],
    imports: [
        CommonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,

        DatasetViewModule,
        DatasetViewMenuModule,
        FeatureFlagModule,
        SafeHtmlModule,
    ],
})
export class DatasetFlowDetailsModule {}
