import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-task-details-logs-tab",
    templateUrl: "./task-details-logs-tab.component.html",
    styleUrls: ["./task-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsLogsTabComponent {
    public isCollapsed1 = false;

    public clickLogItem(): void {
        this.isCollapsed1 = !this.isCollapsed1;
    }
}
