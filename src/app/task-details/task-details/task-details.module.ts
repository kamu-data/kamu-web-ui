import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskDetailsComponent } from "./task-details.component";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetModule } from "src/app/dataset-view/dataset.module";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatMenuModule } from "@angular/material/menu";
import { TaskDetailsSummaryTabComponent } from './components/task-details-summary-tab/task-details-summary-tab.component';
import { TaskDetailsHistoryTabComponent } from './components/task-details-history-tab/task-details-history-tab.component';

@NgModule({
    declarations: [TaskDetailsComponent, TaskDetailsSummaryTabComponent, TaskDetailsHistoryTabComponent],
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
export class TaskDetailsModule {}
