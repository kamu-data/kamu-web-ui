import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatasetBasicsFragment, FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { Observable } from "rxjs";
import { MaybeUndefined } from "src/app/common/app.types";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Output() onPageChangeEmit = new EventEmitter<number>();
    public searchFilter = "";
    public flowConnection$: Observable<MaybeUndefined<FlowConnectionDataFragment>>;
    public readonly FLOW_RUNS_PER_PAGE = 150;
    public currentPage = 0;

    constructor(private flowsService: DatasetFlowsService) {}

    ngOnInit(): void {
        this.flowConnection$ = this.flowsService.datasetFlowsList({
            datasetId: this.datasetBasics.id,
            page: this.currentPage,
            perPage: this.FLOW_RUNS_PER_PAGE,
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

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }

    public refreshFilter(): void {
        this.searchFilter = "";
    }
}
