import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    Account,
    DatasetBasicsFragment,
    DatasetFlowType,
    DatasetKind,
    DatasetOverviewFragment,
    FlowStatus,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { Observable, Subject, filter, map, switchMap, tap, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { CancelFlowArgs, FilterByInitiatorEnum, FlowsTableData } from "./components/flows-table/flows-table.types";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { FlowsTableProcessingBaseComponent } from "./components/flows-table/flows-table-processing-base.component";

@Component({
    selector: "app-flows",
    templateUrl: "./flows.component.html",
    styleUrls: ["./flows.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Output() onPageChangeEmit = new EventEmitter<number>();
    public searchFilter = "";
    public flowConnectionData$: Observable<MaybeUndefined<FlowsTableData>>;
    public allFlowsPaused$: Observable<MaybeUndefined<boolean>>;
    public searchByAccount: MaybeNull<Account>;
    public currentPage = 1;
    public overview: DatasetOverviewFragment;
    public accountFlowInitiators$: Observable<Account[]>;
    public readonly DISPLAY_COLUMNS: string[] = ["description", "information", "creator", "options"]; //1
    public readonly INITIATORS: string[] = Object.keys(FilterByInitiatorEnum);
    private readonly loadingFlowsList = new Subject<boolean>();

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef,
        private datasetSubsService: DatasetSubscriptionsService,
    ) {
        super();
    }

    public get loadingFlowsList$(): Observable<boolean> {
        return this.loadingFlowsList;
    }

    ngOnInit(): void {
        this.getTileWidgetData();
        this.datasetFlowListByPage();
        this.allFlowsPaused$ = this.flowsService.allFlowsPaused(this.datasetBasics.id);
        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.datasetFlowListByPage()),
            this.datasetSubsService.overviewChanges.subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            }),
        );
        this.fetchAccountFlowInitiators();
    }

    public get isSetPollingSourceEmpty(): boolean {
        return !this.overview.metadata.currentPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetTransformEmpty(): boolean {
        return !this.overview.metadata.currentTransform && this.datasetBasics.kind === DatasetKind.Derivative;
    }

    public navigateToAddPollingSource(): void {
        this.navigationService.navigateToAddPollingSource({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public navigateToSetTransform(): void {
        this.navigationService.navigateToSetTransform({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }

    public getFlowConnectionData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
    ): void {
        this.flowConnectionData$ = timer(0, 10000).pipe(
            switchMap(() =>
                this.flowsService.datasetFlowsList({
                    datasetId: this.datasetBasics.id,
                    page: page - 1,
                    perPage: this.TABLE_FLOW_RUNS_PER_PAGE,
                    filters: { byStatus: filterByStatus, byInitiator: filterByInitiator },
                }),
            ),
        );
    }

    public getTileWidgetData(): void {
        this.tileWidgetData$ = timer(0, 10000).pipe(
            tap(() => this.loadingFlowsList.next(false)),
            switchMap(() =>
                this.flowsService.datasetFlowsList({
                    datasetId: this.datasetBasics.id,
                    page: 0,
                    perPage: this.WIDGET_FLOW_RUNS_PER_PAGE,
                    filters: {},
                }),
            ),
            tap(() => this.loadingFlowsList.next(true)),
        );
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
        this.trackSubscription(
            this.flowsService
                .datasetTriggerFlow({
                    datasetId: this.datasetBasics.id,
                    datasetFlowType:
                        this.datasetBasics.kind === DatasetKind.Root
                            ? DatasetFlowType.Ingest
                            : DatasetFlowType.ExecuteTransform,
                })
                .subscribe((success: boolean) => {
                    if (success) {
                        setTimeout(() => {
                            this.refreshFlow();
                            this.cdr.detectChanges();
                        }, this.TIMEOUT_REFRESH_FLOW);
                    }
                }),
        );
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
            this.resetSearchByAccount();
        }
        this.filterByInitiator = initiator;
    }

    public onSearchByAccountName(account: MaybeNull<Account>): void {
        if (account) {
            this.getFlowConnectionData(this.currentPage, this.filterByStatus, { accounts: [account.id] });
            this.searchByAccount = account;
        }
    }

    public toggleStateDatasetFlowConfigs(paused: boolean): void {
        if (!paused) {
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
        setTimeout(() => {
            this.updateStateComponent();
            this.cdr.detectChanges();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    private updateStateComponent(): void {
        this.allFlowsPaused$ = this.flowsService.allFlowsPaused(this.datasetBasics.id);
        this.getTileWidgetData();
        this.getFlowConnectionData(this.currentPage, this.filterByStatus);
    }

    private resetSearchByAccount(): void {
        this.searchByAccount = null;
    }

    public refreshFlow(): void {
        this.getTileWidgetData();
        this.getFlowConnectionData(this.currentPage);
    }

    public onCancelFlow(params: CancelFlowArgs): void {
        this.trackSubscription(
            this.flowsService
                .cancelScheduledTasks({
                    datasetId: params.datasetId,
                    flowId: params.flowId,
                })
                .subscribe((success: boolean) => {
                    if (success) {
                        setTimeout(() => {
                            this.refreshFlow();
                        }, this.TIMEOUT_REFRESH_FLOW);
                    }
                }),
        );
    }

    private fetchAccountFlowInitiators(): void {
        this.accountFlowInitiators$ = this.flowsService.flowsInitiators(this.datasetBasics.id).pipe(
            map((accounts) =>
                accounts.sort((a: Account, b: Account) => {
                    if (a.accountName < b.accountName) return -1;
                    if (a.accountName > b.accountName) return 1;
                    return 0;
                }),
            ),
        );
    }
}
