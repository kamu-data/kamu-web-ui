import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatasetBasicsFragment, FlowConnectionDataFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { Observable, filter, map } from "rxjs";
import { MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Output() onPageChangeEmit = new EventEmitter<number>();
    public searchFilter = "";
    public flowConnection$: Observable<MaybeUndefined<FlowConnectionDataFragment>>;
    public readonly FLOW_RUNS_PER_PAGE = 150;
    public currentPage = 1;

    constructor(private flowsService: DatasetFlowsService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.getDatasetFlowList(this.currentPage);
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.changePageByUrl()),
        );
    }

    public getDatasetFlowList(page: number): void {
        this.flowConnection$ = this.flowsService.datasetFlowsList({
            datasetId: this.datasetBasics.id,
            page: page - 1,
            perPage: this.FLOW_RUNS_PER_PAGE,
        });
    }

    public onPageChange(page: number): void {
        this.onPageChangeEmit.emit(page);
    }

    public changePageByUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
            this.getDatasetFlowList(this.currentPage);
        } else {
            this.getDatasetFlowList(1);
        }
    }

    public refreshFilter(): void {
        this.searchFilter = "";
    }
}
