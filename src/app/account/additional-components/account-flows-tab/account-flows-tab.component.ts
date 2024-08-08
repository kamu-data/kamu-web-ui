import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { combineLatest, map, of, switchMap, timer } from "rxjs";
import { MaybeNull } from "src/app/common/app.types";
import {
    AccountType,
    DatasetListFlowsDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { AccountService } from "src/app/services/account.service";
import { AccountTabs } from "../../account.constants";
import { environment } from "src/environments/environment";
import { TEST_ACCOUNT_ID } from "src/app/search/mock.data";
import { FlowsTableProcessingBaseComponent } from "src/app/common/components/flows-table/flows-table-processing-base.component";
import { FlowsTableFiltersOptions } from "src/app/common/components/flows-table/flows-table.types";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsTabComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input() accountName: string;
    public nodes: FlowSummaryDataFragment[] = [];
    public searchByDataset: DatasetListFlowsDataFragment[] = [];
    public readonly DISPLAY_COLUMNS = ["description", "information", "creator", "dataset", "options"];

    constructor(private accountService: AccountService) {
        super();
    }

    ngOnInit(): void {
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage);
    }

    public fetchTableData(
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
                        perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                        perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: {
                            byFlowType: null,
                            byStatus: filterByStatus,
                            byInitiator: filterByInitiator,
                            byDatasetIds: datasetsIds ?? [],
                        },
                    }),
                    this.accountService.accountAllFlowsPaused(this.accountName),
                    // TODO: Implemented all accounts with flows from API
                    of([
                        {
                            accountName: "kamu",
                            accountType: AccountType.User,
                            id: TEST_ACCOUNT_ID,
                            displayName: "kamu",
                            isAdmin: true,
                        },
                    ]),
                ]),
            ),
            map(([mainTableFlowsData, allFlowsPaused, flowInitiators]) => {
                return { mainTableFlowsData, allFlowsPaused, flowInitiators };
            }),
        );
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS);
        } else {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS, page);
        }
        this.fetchTableData(page);
    }

    public toggleStateAccountFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.accountService.accountPauseFlows(this.accountName).subscribe();
        } else {
            this.accountService.accountResumeFlows(this.accountName).subscribe();
        }
        setTimeout(() => {
            this.refreshFlow();
            this.cdr.detectChanges();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        this.searchByDataset = filters?.datasets ?? [];
        this.searchByFilters(filters);
    }
}
