import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-task-details-summary-tab",
    templateUrl: "./task-details-summary-tab.component.html",
    styleUrls: ["./task-details-summary-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsSummaryTabComponent {}
