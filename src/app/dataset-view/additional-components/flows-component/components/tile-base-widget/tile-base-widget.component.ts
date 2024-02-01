import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import moment from "moment";
import { FlowDataFragment, FlowStatus, FlowOutcome, Scalars } from "src/app/api/kamu.graphql.interface";
import { convertSecondsToHumanReadableFormat } from "src/app/common/app.helpers";

@Component({
    selector: "app-tile-base-widget",
    templateUrl: "./tile-base-widget.component.html",
    styleUrls: ["./tile-base-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TileBaseWidgetComponent {
    @Input() public nodes: FlowDataFragment[];
    public lastRunsCount = 150;
    public readonly FlowStatus = FlowStatus;
    public readonly FlowOutcome = FlowOutcome;

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]): string {
        const result = moment(d2).seconds() - moment(d1).seconds();
        return convertSecondsToHumanReadableFormat(result) ? convertSecondsToHumanReadableFormat(result) : "-";
    }
}
