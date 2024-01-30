import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import moment from "moment";
import { FlowDataFragment, FlowStatus, FlowOutcome, Scalars } from "src/app/api/kamu.graphql.interface";

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
        const startDate = moment(d1);
        const endDate = moment(d2);
        const result = startDate.from(endDate).substring(0, startDate.from(endDate).lastIndexOf(" "));
        return result === "Invalid" ? "-" : "for " + result;
    }
}
