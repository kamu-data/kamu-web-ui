import { MaybeNull } from "./../../../../../common/app.types";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { PageBasedInfo, Task, TaskStatus } from "src/app/api/kamu.graphql.interface";
import { mockPageBasedInfo } from "src/app/search/mock.data";

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
export class TasksTableComponent implements OnInit, OnDestroy {
    @Input() tasks: MaybeNull<Task[]>;
    // public displayedColumns: string[] = ["description", "information", "creator", "options"];
    public displayedColumns: string[] = ["description"];

    constructor(private cdr: ChangeDetectorRef) {}
    public pageInfo: PageBasedInfo = mockPageBasedInfo;
    public currentPage = 1;
    public readonly TaskStatus = TaskStatus;
    public t: any;
    public x: any;

    ngOnInit(): void {
        this.t = setInterval(() => {
            if (this.tasks?.length) {
                this.tasks[0].status = TaskStatus.Finished;
                this.tasks[1].status = TaskStatus.Running;
                this.cdr.detectChanges();
            }
        }, 2000);
        this.x = setInterval(() => {
            if (this.tasks?.length) {
                this.tasks[0].status = TaskStatus.Running;
                this.tasks[1].status = TaskStatus.Finished;
                this.cdr.detectChanges();
            }
        }, 4000);
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
    }
}
