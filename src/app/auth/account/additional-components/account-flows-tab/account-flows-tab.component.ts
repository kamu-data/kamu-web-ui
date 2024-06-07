import { AccountType } from "./../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Observable, combineLatest, map, of, switchMap, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import {
    CancelFlowArgs,
    FilterByInitiatorEnum,
    FlowsTableData,
} from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.types";
import {
    Account,
    Dataset,
    FlowStatus,
    FlowSummaryDataFragment,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { AccountService } from "src/app/services/account.service";
import { AccountTabs } from "../../account.constants";
import ProjectLinks from "src/app/project-links";
import { requireValue } from "src/app/common/app.helpers";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table-processing-base.component";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsTabComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input() accountName: string;
    public nodes: FlowSummaryDataFragment[] = [];
    public searchByDataset: MaybeNull<Dataset> = null;
    public flowConnectionData$: Observable<{
        mainTableFlowsData: FlowsTableData;
        tileWidgetListFlowsData: FlowsTableData;
        allFlowsPaused: MaybeUndefined<boolean>;
        flowInitiators: Account[];
    }>;
    public readonly DISPLAY_COLUMNS = ["description", "information", "creator", "dataset", "options"];

    constructor(private accountService: AccountService) {
        super();
    }

    ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    private fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void {
        this.flowConnectionData$ = timer(0, environment.delay_polling_ms).pipe(
            switchMap(() =>
                combineLatest([
                    this.accountService.getAccountListFlows({
                        accountName: this.accountName,
                        page: page - 1,
                        perPage: this.TABLE_FLOW_RUNS_PER_PAGE,
                        filters: {
                            byFlowType: null,
                            byStatus: filterByStatus,
                            byInitiator: filterByInitiator,
                            byDatasetIds: datasetsIds ?? [],
                        },
                    }),
                    this.accountService.getAccountListFlows({
                        accountName: this.accountName,
                        page: 0,
                        perPage: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: { byFlowType: null, byStatus: null, byInitiator: null, byDatasetIds: [] },
                    }),
                    this.accountService.accountAllFlowsPaused(this.accountName),
                    // TODO: Implemented all accounts with flows from API
                    of([
                        {
                            accountName: "kamu",
                            accountType: AccountType.User,
                            id: "1",
                            displayName: "kamu",
                            isAdmin: true,
                        },
                    ]),
                ]),
            ),
            map(([mainTableFlowsData, tileWidgetListFlowsData, allFlowsPaused, flowInitiators]) => {
                return { mainTableFlowsData, tileWidgetListFlowsData, allFlowsPaused, flowInitiators };
            }),
        );
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS);
        } else {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS, page);
        }
        this.fetchTableData(page);
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
        }
        this.filterByInitiator = initiator;
    }

    public onSearchByDatasetName(dataset: MaybeNull<Dataset>): void {
        this.fetchTableData(this.currentPage, this.filterByStatus, null, dataset ? [dataset.id] : []);
        this.searchByDataset = dataset;
    }

    public refreshFlow(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
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

    public toggleStateAccountFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.accountService.accountPauseFlows(this.accountName).subscribe();
        } else {
            this.accountService.accountResumeFlows(this.accountName).subscribe();
        }
        setTimeout(() => {
            this.refreshFlow();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    public onSearchByAccountName(account: MaybeNull<Account>): void {
        if (account) {
            console.log("===>", account);
            //  this.getFlowConnectionData(this.currentPage, this.filterByStatus, { accounts: [account.id] });
            this.searchByAccount = account;
        }
    }
}
