import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FlowDataFragment, FlowOutcome, FlowStatus, Scalars } from "src/app/api/kamu.graphql.interface";
import moment from "moment";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent {
    @Input() public nodes: FlowDataFragment[];
    public displayedColumns: string[] = ["description", "information", "creator", "options"];
    public readonly FlowStatus = FlowStatus;
    public readonly FlowOutcome = FlowOutcome;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]) {
        const startDate = moment(d1);
        const endDate = moment(d2);
        const result = "for " + startDate.from(endDate).substring(0, startDate.from(endDate).lastIndexOf(" "));
        return result;
    }
}
