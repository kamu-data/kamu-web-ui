import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
    DatasetBasicsFragment,
    FlowConnectionDataFragment,
    FlowStatus,
    InitiatorFilterInput,
    FlowSummaryDataFragment,
    FlowOutcome,
} from "src/app/api/kamu.graphql.interface";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { Observable, filter, map } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { FilterByInitiatorEnum } from "./components/flows-table/flows-table.types";

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
    public tileWidgetData$: Observable<MaybeUndefined<FlowConnectionDataFragment>>;
    public flowConnectionData$: Observable<MaybeUndefined<FlowConnectionDataFragment>>;
    public filterByStatus: MaybeNull<FlowStatus> = null;
    public filterByInitiator = FilterByInitiatorEnum.All;
    public searchByAccountName = "";
    public currentPage = 1;
    public readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    public readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;

    constructor(
        private flowsService: DatasetFlowsService,
        private router: Router,
        private navigationService: NavigationService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getTileWidgetData();
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

    public getFlowConnectionData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
    ): void {
        this.flowConnectionData$ = this.flowsService.datasetFlowsList({
            datasetId: this.datasetBasics.id,
            page: page - 1,
            perPage: this.TABLE_FLOW_RUNS_PER_PAGE,
            filters: { byStatus: filterByStatus, byInitiator: filterByInitiator },
        });
    }

    public getTileWidgetData(): void {
        this.tileWidgetData$ = this.flowsService.datasetFlowsList({
            datasetId: this.datasetBasics.id,
            page: 0,
            perPage: this.WIDGET_FLOW_RUNS_PER_PAGE,
            filters: {},
        });
    }

    public onPageChange(page: number): void {
        this.onPageChangeEmit.emit(page);
    }

    public datasetFlowListByPage(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
            this.getFlowConnectionData(this.currentPage, this.filterByStatus);
        } else {
            this.currentPage = 1;
            this.getFlowConnectionData(this.currentPage, this.filterByStatus);
        }
    }

    public updateSettings(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: SettingsTabsEnum.SCHEDULING,
        });
    }

    public updateNow(): void {
        this.getTileWidgetData();
        this.getFlowConnectionData(this.currentPage, this.filterByStatus);
    }

    public onChangeFilterByStatus(status: MaybeNull<FlowStatus>): void {
        this.getFlowConnectionData(this.currentPage, status);
        this.filterByStatus = status;
    }

    public onChangeFilterByInitiator(initiator: FilterByInitiatorEnum): void {
        if (initiator !== FilterByInitiatorEnum.Account) {
            let filterOptions: MaybeNull<InitiatorFilterInput> = null;
            if (initiator === FilterByInitiatorEnum.System) {
                filterOptions = { system: true };
            }
            this.getFlowConnectionData(this.currentPage, this.filterByStatus, filterOptions);
            this.resetSearchByAccountName();
        }
        this.filterByInitiator = initiator;
    }

    public onSearchByAccountName(accountName: string): void {
        this.getFlowConnectionData(this.currentPage, this.filterByStatus, { account: accountName });
        this.searchByAccountName = accountName;
    }

    public toggleDatasetUpdates(flow: FlowSummaryDataFragment): void {
        if (flow.outcome !== FlowOutcome.Aborted) {
            this.trackSubscription(
                this.flowsService
                    .datasetPauseFlows({
                        datasetId: this.datasetBasics.id,
                    })
                    .subscribe(),
            );
        } else {
            this.trackSubscription(
                this.flowsService
                    .datasetResumeFlows({
                        datasetId: this.datasetBasics.id,
                    })
                    .subscribe(),
            );
        }
    }

    private resetSearchByAccountName(): void {
        this.searchByAccountName = "";
    }
}
