import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TasksService } from "./services/tasks.service";
import { Observable, shareReplay } from "rxjs";
import { Task } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-tasks",
    templateUrl: "./tasks.component.html",
    styleUrls: ["./tasks.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
    public searchFilter = "";
    public datasetTasks$: Observable<Task[]>;

    constructor(private tasksService: TasksService) {}

    ngOnInit(): void {
        this.datasetTasks$ = this.tasksService.datasetAllTasks().pipe(shareReplay());
    }

    public refreshFilter(): void {
        this.searchFilter = "";
    }
}
