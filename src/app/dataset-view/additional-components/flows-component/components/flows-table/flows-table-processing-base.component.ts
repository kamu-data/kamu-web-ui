import { Observable } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { BaseComponent } from "src/app/common/base.component";
import { CancelFlowArgs, FilterByInitiatorEnum, FlowsTableData } from "./flows-table.types";
import { Account, FlowStatus, InitiatorFilterInput } from "src/app/api/kamu.graphql.interface";
import { ChangeDetectorRef, Directive, inject } from "@angular/core";
import { DatasetFlowsService } from "../../services/dataset-flows.service";
import { NavigationService } from "src/app/services/navigation.service";
import { requireValue } from "src/app/common/app.helpers";
import ProjectLinks from "src/app/project-links";

@Directive()
export abstract class FlowsTableProcessingBaseComponent extends BaseComponent {
    public tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;
    public filterByStatus: MaybeNull<FlowStatus> = null;
    public filterByInitiator = FilterByInitiatorEnum.All;
    public searchByAccount: MaybeNull<Account>;
    public currentPage = 1;
    public readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    public readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly TIMEOUT_REFRESH_FLOW = 800;
    public readonly INITIATORS = Object.keys(FilterByInitiatorEnum);
    public flowConnectionData$: Observable<{
        mainTableFlowsData: FlowsTableData;
        tileWidgetListFlowsData: FlowsTableData;
        allFlowsPaused: MaybeUndefined<boolean>;
        flowInitiators: Account[];
    }>;

    protected flowsService = inject(DatasetFlowsService);
    protected navigationService = inject(NavigationService);
    protected cdr = inject(ChangeDetectorRef)

    abstract fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void;

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
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

    public refreshFlow(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    public onChangeFilterByStatus(status: MaybeNull<FlowStatus>): void {
        this.fetchTableData(this.currentPage, status);
        this.filterByStatus = status;
    }

    public onChangeFilterByInitiator(initiator: FilterByInitiatorEnum): void {
        if (initiator !== FilterByInitiatorEnum.Account) {
            let filterOptions: MaybeNull<InitiatorFilterInput> = null;
            if (initiator === FilterByInitiatorEnum.System) {
                filterOptions = { system: true };
            }
            this.fetchTableData(this.currentPage, this.filterByStatus, filterOptions);
            this.resetSearchByAccount();
        }
        this.filterByInitiator = initiator;
    }

    public onSearchByAccountName(account: MaybeNull<Account>): void {
        if (account) {
            this.fetchTableData(this.currentPage, this.filterByStatus, { accounts: [account.id] });
            this.searchByAccount = account;
        }
    }

    private resetSearchByAccount(): void {
        this.searchByAccount = null;
    }
}
