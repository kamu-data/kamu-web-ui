import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TaskStatus, Task, TaskOutcome } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { TaskElement } from "../tasks-table/tasks-table.types";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    public lastRunsCount = 150;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;

    @Input() tasks: MaybeNull<TaskElement[]>;
    // public arrTiles = Array(1000)
    //     .fill(0)
    //     .map((_, index) => index)
    //     .reverse();
}
