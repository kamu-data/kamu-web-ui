import { MaybeNull } from "./../../../../../common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { PageBasedInfo, Task, TaskOutcome, TaskStatus } from "src/app/api/kamu.graphql.interface";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { TaskElement } from "./tasks-table.types";

// const ELEMENT_DATA: TaskElement[] = [
//     { description: "Manual polling source update", information: "Running", creator: "kamu" },
//     { description: "Scheduled polling source update", information: "Scheduled", creator: "canada-co" },
// ];

@Component({
    selector: "app-tasks-table",
    templateUrl: "./tasks-table.component.html",
    styleUrls: ["./tasks-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent {
    @Input() tasks: MaybeNull<TaskElement[]>;
    public displayedColumns: string[] = ["description", "information", "creator", "options"];

    public pageInfo: PageBasedInfo = mockPageBasedInfo;
    public currentPage = 1;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;
}
