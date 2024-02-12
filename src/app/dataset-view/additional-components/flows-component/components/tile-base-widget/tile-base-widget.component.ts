import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import moment from "moment";
import { FlowStatus, FlowOutcome, Scalars, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { convertSecondsToHumanReadableFormat } from "src/app/common/app.helpers";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";

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

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]): string {
        const result = convertSecondsToHumanReadableFormat(moment(d2).seconds() - moment(d1).seconds());
        return result ? result : "-";
    }

    public tileWidgetClass(node: FlowSummaryDataFragment): string {
        return TileBaseWidgetHelpers.tileWidgetClass(node);
    }
}
