import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { FlowsTableData } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import {
    Account,
    DatasetConnectionDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { AccountService } from "src/app/services/account.service";
import { AccountTabs } from "../../account.constants";
import ProjectLinks from "src/app/project-links";
import { requireValue } from "src/app/common/app.helpers";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsTabComponent extends BaseComponent implements OnInit {
    @Input() accountName: string;
    public tileWidgetData$: Observable<MaybeUndefined<FlowsTableData>>;
    public nodes: FlowSummaryDataFragment[] = [mockFlowSummaryDataFragments[0]];
    public filterByStatus: MaybeNull<FlowStatus> = null;
    // public filterByInitiator = FilterByInitiatorEnum.All;
    // public searchByAccount: MaybeNull<Account> = null;
    public searchByAccount: MaybeNull<Account>;
    public currentPage = 1;

    public flowConnectionData$: Observable<[FlowsTableData, MaybeUndefined<DatasetConnectionDataFragment>]>;
    public readonly WIDGET_FLOW_RUNS_PER_PAGE: number = 150;
    public readonly TABLE_FLOW_RUNS_PER_PAGE: number = 15;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly TIMEOUT_REFRESH_FLOW = 800;

    constructor(
        private flowsService: DatasetFlowsService,
        private router: Router,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
        private datasetSubsService: DatasetSubscriptionsService,
        private accountService: AccountService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getPageFromUrl();
        this.getTableDate(this.currentPage);
    }

    private getTableDate(page: number): void {
        this.flowConnectionData$ = combineLatest([
            this.accountService.getAccountListFlows({
                accounName: this.accountName,
                page: page - 1,
                perPage: this.TABLE_FLOW_RUNS_PER_PAGE,
                filters: { byFlowType: null, byStatus: this.filterByStatus, byInitiator: null, byDatasetIds: [] },
            }),
            this.accountService.getDatasetsWithFlows(this.accountName),
        ]);
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
            this.getTableDate(page);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS, page);
        this.getTableDate(page);
    }
}
