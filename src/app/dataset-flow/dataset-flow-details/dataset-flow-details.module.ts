import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DatasetModule } from "src/app/dataset-view/dataset.module";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { FlowDetailsHistoryTabComponent } from "./tabs/flow-details-history-tab/flow-details-history-tab.component";
import { FlowDetailsSummaryTabComponent } from "./tabs/flow-details-summary-tab/flow-details-summary-tab.component";
import { FlowDetailsLogsTabComponent } from './tabs/flow-details-logs-tab/flow-details-logs-tab.component';

@NgModule({
    declarations: [DatasetFlowDetailsComponent, FlowDetailsHistoryTabComponent, FlowDetailsSummaryTabComponent, FlowDetailsLogsTabComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        DatasetModule,
        RouterModule,
        AngularSvgIconModule,
        MatMenuModule,
    ],
})
export class DatasetFlowDetailsModule {}
