import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageBasedInfo } from "src/app/api/kamu.graphql.interface";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { TaskElement } from "./tasks-table.types";

const ELEMENT_DATA: TaskElement[] = [
    { description: "Manual polling source update", information: "Running", creator: "kamu" },
    { description: "Scheduled polling source update", information: "Scheduled", creator: "canada-co" },
];

@Component({
    selector: "app-tasks-table",
    templateUrl: "./tasks-table.component.html",
    styleUrls: ["./tasks-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent {
    public displayedColumns: string[] = ["description", "information", "creator", "options"];
    public dataSource = ELEMENT_DATA;
    public pageInfo: PageBasedInfo = mockPageBasedInfo;
    public currentPage = 1;
}
