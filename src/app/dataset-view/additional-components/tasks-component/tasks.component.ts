import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { TasksService } from "./services/tasks.service";
import { TaskOutcome, TaskStatus } from "src/app/api/kamu.graphql.interface";
import { TaskElement, updatedFinishedTaskElement } from "./components/tasks-table/tasks-table.types";

@Component({
    selector: "app-tasks",
    templateUrl: "./tasks.component.html",
    styleUrls: ["./tasks.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
    public searchFilter = "";
    public tasks: TaskElement[];
    private t: any;
    private x: any;
    private y: any;
    private z: any;
    public readonly TaskStatus = TaskStatus;
    public readonly TaskOutcome = TaskOutcome;

    constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.tasksService
            .datasetAllTasks()
            // .pipe(shareReplay())
            .subscribe((data) => {
                this.tasks = data;
            });

        // this.t = setInterval(() => {
        //     if (this.tasks.length) {
        //         this.tasks[0].status = TaskStatus.Finished;
        //         this.tasks[0].outcome = TaskOutcome.Success;
        //         this.tasks[0].description = "Scheduled polling source updated";
        //         this.tasks[0].information = "Ingested 123 new records";

        //         this.tasks[1].status = TaskStatus.Running;
        //         this.tasks[1].outcome = undefined;
        //         this.tasks[1].description = "Manual polling source updating...";
        //         this.tasks[1].information = "Polling data from http://example.com";
        //         this.tasks = [...this.tasks];
        //         this.cdr.detectChanges();
        //     }
        // }, 2000);
        // this.x = setInterval(() => {
        //     if (this.tasks.length) {
        //         this.tasks[0].status = TaskStatus.Running;
        //         this.tasks[0].outcome = undefined;
        //         this.tasks[0].description = "Manual polling source updating...";
        //         this.tasks[0].information = "Polling data from http://example.com";

        //         this.tasks[1].status = TaskStatus.Finished;
        //         this.tasks[1].outcome = TaskOutcome.Success;
        //         this.tasks[1].description = "Scheduled polling source updated";
        //         this.tasks[1].information = "Ingested 123 new records";
        //         this.tasks = [...this.tasks];
        //         this.cdr.detectChanges();
        //     }
        // }, 6000);
        // this.z = setInterval(() => {
        //     if (this.tasks.length) {
        //         this.tasks = [...this.tasks, updatedFinishedTaskElement];
        //         this.cdr.detectChanges();
        //     }
        // }, 8000);
    }

    public refreshFilter(): void {
        this.searchFilter = "";
    }

    ngOnDestroy(): void {
        if (this.t) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            clearInterval(this.t);
        }
        if (this.x) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            clearInterval(this.x);
        }
        if (this.y) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            clearInterval(this.y);
        }
        if (this.z) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            clearInterval(this.z);
        }
    }
}
