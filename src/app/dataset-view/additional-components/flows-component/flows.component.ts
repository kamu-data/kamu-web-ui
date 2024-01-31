import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
    DatasetBasicsFragment,
    FlowConnectionDataFragment,
    FlowDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { Observable, filter, map, of, switchMap } from "rxjs";
import { MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";

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
    public tileWidgetData: FlowDataFragment[];
    public readonly FLOW_RUNS_PER_PAGE = 150;
    public currentPage = 1;

    constructor(
        private flowsService: DatasetFlowsService,
        private router: Router,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.datasetFlowListByPage();
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.datasetFlowListByPage()),
        );
    }

    public getDatasetFlowList(page: number): void {
        this.flowConnection$ = this.flowsService
            .datasetFlowsList({
                datasetId: this.datasetBasics.id,
                page: 0,
                perPage: this.FLOW_RUNS_PER_PAGE,
            })
            .pipe(
                switchMap((data: MaybeUndefined<FlowConnectionDataFragment>) => {
                    if (data?.nodes.length) {
                        this.tileWidgetData = data.nodes;
                    }
                    if (page > 1) {
                        return this.flowsService.datasetFlowsList({
                            datasetId: this.datasetBasics.id,
                            page: page - 1,
                            perPage: this.FLOW_RUNS_PER_PAGE,
                        });
                    }
                    return of(data);
                }),
            );
    }

    public onPageChange(page: number): void {
        this.onPageChangeEmit.emit(page);
    }

    public datasetFlowListByPage(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
            this.getDatasetFlowList(this.currentPage);
        } else {
            this.currentPage = 1;
            this.getDatasetFlowList(this.currentPage);
        }
    }

    public refreshFilter(): void {
        this.searchFilter = "";
    }

    public updateSettings(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.SCHEDULING,
        });
    }
}
