import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { TaskStatus, TaskOutcome } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import { TaskElement } from "../flows-table/tasks-table.types";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent implements OnInit, OnChanges {
    public lastRunsCount = 150;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;

    @Input() tasks: MaybeNull<TaskElement[]>;
    public arrTiles = Array<TaskElement | null>(this.lastRunsCount).fill(null);

    ngOnInit(): void {
        this.fillTileBaseWidget(this.tasks);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const taskChanges = changes.tasks;
        if (
            taskChanges.previousValue &&
            (taskChanges.previousValue as TaskElement[]).length !== taskChanges.currentValue &&
            (taskChanges.currentValue as TaskElement[]).length
        ) {
            this.fillTileBaseWidget(taskChanges.currentValue as TaskElement[]);
        }
    }

    private fillTileBaseWidget(tasks: MaybeNull<TaskElement[]>): void {
        if (tasks?.length) {
            this.arrTiles.splice(0, tasks.length);
            this.arrTiles = [...tasks, ...this.arrTiles];
        }
    }
}
