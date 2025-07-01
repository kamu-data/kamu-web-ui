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
import { FlowDetailsUsageTabComponent } from "./tabs/flow-details-usage-tab/flow-details-usage-tab.component";
import { FlowDetailsAdminTabComponent } from "./tabs/flow-details-admin-tab/flow-details-admin-tab.component";

@NgModule({
    imports: [
        CommonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        DatasetViewModule,
        DatasetFlowDetailsComponent,
        FlowDetailsHistoryTabComponent,
        FlowDetailsLogsTabComponent,
        FlowDetailsSummaryTabComponent,
        FlowDetailsUsageTabComponent,
        FlowDetailsAdminTabComponent,
    ],
})
export class DatasetFlowDetailsModule {}
