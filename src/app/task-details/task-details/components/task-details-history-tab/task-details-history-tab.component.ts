import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-task-details-history-tab",
    templateUrl: "./task-details-history-tab.component.html",
    styleUrls: ["./task-details-history-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsHistoryTabComponent {}
