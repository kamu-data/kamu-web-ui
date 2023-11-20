import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
    selector: "app-tasks",
    templateUrl: "./tasks.component.html",
    styleUrls: ["./tasks.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
    public searchFilter = "";

    public refreshFilter(): void {
        this.searchFilter = "";
    }
}
