import { ChangeDetectionStrategy, Component } from "@angular/core";
import { logs } from "./logs.mock";

@Component({
    selector: "app-task-details-logs-tab",
    templateUrl: "./task-details-logs-tab.component.html",
    styleUrls: ["./task-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsLogsTabComponent {
    public isCollapsed1 = false;
    public logsViewMode = "table";
    public logs = logs;

    public clickLogItem(): void {
        this.isCollapsed1 = !this.isCollapsed1;
    }
}
