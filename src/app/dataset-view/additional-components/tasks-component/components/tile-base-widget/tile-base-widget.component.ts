import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TaskStatus, Task } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    public lastRunsCount = 150;
    public readonly TaskStatus = TaskStatus;

    @Input() tasks: MaybeNull<Task[]>;
    // public arrTiles = Array(1000)
    //     .fill(0)
    //     .map((_, index) => index)
    //     .reverse();
}
