import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull } from "./../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { PageBasedInfo, Scalars, TaskOutcome, TaskStatus } from "src/app/api/kamu.graphql.interface";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { TaskElement } from "./tasks-table.types";
import moment from "moment";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-tasks-table",
    templateUrl: "./tasks-table.component.html",
    styleUrls: ["./tasks-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent extends BaseComponent {
    @Input() tasks: MaybeNull<TaskElement[]>;
    public displayedColumns: string[] = ["description", "information", "creator", "options"];

    public pageInfo: PageBasedInfo = mockPageBasedInfo;
    public currentPage = 1;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;

    constructor(private navigationService: NavigationService) {
        super();
    }

    public durationTask(d1: Scalars["DateTime"], d2: Scalars["DateTime"]) {
        const startDate = moment(d1);
        const endDate = moment(d2);
        const result = "for " + startDate.from(endDate).substring(0, startDate.from(endDate).lastIndexOf(" "));
        //  const result = startDate.from(endDate);
        return result;
    }

    public navigateToTaskDetaisView(taskId: string): void {
        this.navigationService.navigateToTaskDetail({
            accountName: this.getDatasetInfoFromUrl().accountName,
            datasetName: this.getDatasetInfoFromUrl().datasetName,
            taskId,
        });
    }
}
