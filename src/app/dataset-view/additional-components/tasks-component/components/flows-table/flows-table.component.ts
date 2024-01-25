import { MaybeNull } from "../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { PageBasedInfo, Scalars, TaskOutcome, TaskStatus } from "src/app/api/kamu.graphql.interface";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { TaskElement } from "./tasks-table.types";
import moment from "moment";

@Component({
    selector: "app-flows-table",
    templateUrl: "./flows-table.component.html",
    styleUrls: ["./flows-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsTableComponent {
    @Input() tasks: MaybeNull<TaskElement[]>;
    public displayedColumns: string[] = ["description", "information", "creator", "options"];

    public pageInfo: PageBasedInfo = mockPageBasedInfo;
    public currentPage = 1;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]) {
        const startDate = moment(d1);
        const endDate = moment(d2);
        const result = "for " + startDate.from(endDate).substring(0, startDate.from(endDate).lastIndexOf(" "));
        //  const result = startDate.from(endDate);
        return result;
    }
}
