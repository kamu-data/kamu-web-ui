import { MaybeNullOrUndefined } from "./../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowStatus, FlowOutcome, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";
import { DataHelpers } from "src/app/common/data.helpers";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    @Input() public nodes: FlowSummaryDataFragment[];
    public readonly LAST_RUNS_COUNT = 150;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly FlowOutcome: typeof FlowOutcome = FlowOutcome;

    public durationTask(d1: MaybeNullOrUndefined<string>, d2: MaybeNullOrUndefined<string>): string {
        if (!d2 || !d1) return "-";
        return DataHelpers.durationTask(d1, d2);
    }

    public tileWidgetClass(node: FlowSummaryDataFragment): string {
        return TileBaseWidgetHelpers.tileWidgetClass(node);
    }
}
