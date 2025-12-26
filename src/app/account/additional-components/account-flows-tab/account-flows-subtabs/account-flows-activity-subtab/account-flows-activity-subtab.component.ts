/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { AsyncPipe, NgIf } from "@angular/common";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { timer, switchMap, combineLatest, of, map, Observable, tap } from "rxjs";
import {
    AccountFragment,
    DatasetBasicsFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { environment } from "src/environments/environment";
import { AccountFlowsType } from "../../resolvers/account-flows.resolver";
import {
    CancelFlowArgs,
    FilterStatusType,
    FlowsTableData,
    FlowsTableFiltersOptions,
} from "src/app/dataset-flow/flows-table/flows-table.types";
import { AccountService } from "src/app/account/account.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { FlowsTableComponent } from "src/app/dataset-flow/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.component";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import AppValues from "src/app/common/values/app.values";
import { AccountFlowsNav } from "../../account-flows-tab.types";
import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountTabs } from "src/app/account/account.constants";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { requireValue } from "src/app/common/helpers/app.helpers";
import { FlowTablePanelFiltersComponent } from "src/app/dataset-flow/flows-table/components/flow-table-panel-filters/flow-table-panel-filters.component";

@Component({
    selector: "app-account-flows-activity-subtab",
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,

        //-----//
        MatIconModule,
        MatProgressBarModule,
        NgbNavModule,

        //-----//
        TileBaseWidgetComponent,
        FlowsTableComponent,
        FlowTablePanelFiltersComponent,
        PaginationComponent,
    ],
    templateUrl: "./account-flows-activity-subtab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsActivitySubtabComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input({ required: true }) public accountFlowsData: AccountFlowsType;
    @Input({ required: true }) public accountName: string;

    public flowConnectionData$: Observable<{
        flowsData: FlowsTableData;
        allFlowsPaused?: MaybeUndefined<boolean>;
        flowInitiators: AccountFragment[];
    }>;

    public selectedDatasetItems: DatasetBasicsFragment[] = [];
    public selectedAccountItems: AccountFragment[] = [];
    public selectedStatusItems: FilterStatusType[] = [];

    public readonly DISPLAY_COLUMNS = ["description", "information", "creator", "dataset", "options"];
    public nodes: FlowSummaryDataFragment[] = [];
    public searchByDataset: DatasetBasicsFragment[] = [];
    public filters: MaybeNull<FlowsTableFiltersOptions>;

    public readonly AccountFlowsNav: typeof AccountFlowsNav = AccountFlowsNav;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public activeStatusNav: FlowStatus = FlowStatus.Finished;

    private readonly accountService = inject(AccountService);
    private readonly loggedUserService = inject(LoggedUserService);
    private readonly ngZone = inject(NgZone);

    public ngOnInit(): void {
        this.filterByStatus = this.accountFlowsData.flowGroup;
        this.refreshNow();
    }

    public fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus[]>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void {
        this.flowConnectionData$ = timer(0, environment.delay_polling_ms).pipe(
            tap(() => {
                this.getPageFromUrl();
                if (this.filterByStatus) {
                    this.selectedStatusItems = [{ id: this.filterByStatus[0], status: this.filterByStatus[0] }];
                }
            }),
            switchMap(() =>
                combineLatest([
                    this.accountService.getAccountListFlows({
                        accountName: this.accountName,
                        page: page - 1,
                        perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                        perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                        filters: {
                            byProcessType: null,
                            byStatus: filterByStatus,
                            byInitiator: filterByInitiator,
                            byDatasetIds: datasetsIds ?? [],
                        },
                    }),
                    this.accountService.accountAllFlowsPaused(this.loggedUser.accountName),
                    of([this.loggedUser]),
                ]),
            ),
            map(([flowsData, allFlowsPaused, flowInitiators]) => {
                return { flowsData, allFlowsPaused, flowInitiators };
            }),
        );
    }

    public toggleStateAccountFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.accountService.accountPauseFlows(this.loggedUser.accountName).subscribe();
        } else {
            this.accountService.accountResumeFlows(this.loggedUser.accountName).subscribe();
        }
        setTimeout(() => {
            this.refreshNow();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    public get loggedUser(): AccountFragment {
        return this.loggedUserService.currentlyLoggedInUser;
    }

    public override onAbortFlow(params: CancelFlowArgs): void {
        const datasetId: string = requireValue(
            params.datasetId,
            "Aborting flows without datasetId is not supported yet",
        );
        this.flowsService
            .cancelFlowRun({
                datasetId,
                flowId: params.flowId,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((success: boolean) => {
                if (success) {
                    setTimeout(() => {
                        this.refreshNow();
                    }, this.TIMEOUT_REFRESH_FLOW);
                }
            });
    }

    public onNavChange(event: NgbNavChangeEvent): void {
        const nextNav = event.nextId as AccountFlowsNav;
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS, undefined, nextNav);
    }

    public onNavStatusChange(event: NgbNavChangeEvent): void {
        const currentNav = event.nextId as FlowStatus;
        const nextNav = currentNav === FlowStatus.Running ? [FlowStatus.Running, FlowStatus.Retrying] : [currentNav];
        this.currentPage = 1;
        this.filterByStatus = nextNav;
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            this.accountFlowsData.activeNav,
            nextNav,
        );
        this.refreshNow();
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(
                    this.loggedUser.accountName,
                    AccountTabs.FLOWS,
                    undefined,
                    this.accountFlowsData.activeNav,
                    this.accountFlowsData.flowGroup,
                ),
            );
        } else {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(
                    this.loggedUser.accountName,
                    AccountTabs.FLOWS,
                    page,
                    this.accountFlowsData.activeNav,
                    this.accountFlowsData.flowGroup,
                ),
            );
        }
        this.currentPage = page;
        if (!this.filters?.status?.length) {
            this.refreshNow();
        } else {
            this.onSearchByFiltersChange(this.filters);
        }
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        this.searchByFilters(filters);
        this.searchByDataset = filters?.datasets ?? [];
        this.filters = filters;
        if (filters) {
            this.selectedAccountItems = filters.accounts;
            this.selectedDatasetItems = filters.datasets;
        }
        this.refreshNow();
    }

    public onResetFilters(): void {
        this.selectedDatasetItems = [];
        this.selectedAccountItems = [];
        this.selectedStatusItems = [];
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            this.accountFlowsData.activeNav,
        );
    }

    public refreshNow(): void {
        this.fetchTableData(
            this.currentPage,
            this.filterByStatus,
            this.filterInitiator,
            this.selectedDatasetItems.map((x) => x.id),
        );
    }
}
