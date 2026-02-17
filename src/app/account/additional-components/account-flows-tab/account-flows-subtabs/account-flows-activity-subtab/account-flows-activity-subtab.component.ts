/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { BehaviorSubject, combineLatest, map, Observable, of, startWith, Subject, switchMap, tap, timer } from "rxjs";

import {
    AccountFlowFilters,
    AccountFragment,
    DatasetBasicsFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    InitiatorFilterInput,
} from "@api/kamu.graphql.interface";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { requireValue } from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import {
    AccountFiltersParams,
    AccountFlowsNav,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsType } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FlowTablePanelFiltersComponent } from "src/app/dataset-flow/flows-table/components/flow-table-panel-filters/flow-table-panel-filters.component";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FlowsTableComponent } from "src/app/dataset-flow/flows-table/flows-table.component";
import {
    CancelFlowArgs,
    FilterStatusType,
    FlowsTableData,
    FlowsTableFiltersOptions,
} from "src/app/dataset-flow/flows-table/flows-table.types";
import { TileBaseWidgetComponent } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.component";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-account-flows-activity-subtab",
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
    public readonly fetchTrigger$ = new Subject<AccountFiltersParams>();
    public activeStatusNav: FlowStatus = FlowStatus.Finished;
    private readonly loadingFlowsSubject$ = new BehaviorSubject<boolean>(false);

    private readonly accountService = inject(AccountService);
    private readonly loggedUserService = inject(LoggedUserService);
    private readonly ngZone = inject(NgZone);

    public ngOnInit(): void {
        this.filterByStatus = this.accountFlowsData.flowGroup;
        this.refreshNow();
    }

    public get loadingFlows$(): Observable<boolean> {
        return this.loadingFlowsSubject$.asObservable();
    }

    public fetchTableData(
        page: number,
        filterByStatus?: MaybeNull<FlowStatus[]>,
        filterByInitiator?: MaybeNull<InitiatorFilterInput>,
        datasetsIds?: string[],
    ): void {
        const polling$ = timer(0, environment.delay_polling_ms);
        const triggerWithInitial$ = this.fetchTrigger$.pipe(
            startWith({
                page,
                filterByStatus,
                filterByInitiator,
                datasetsIds,
            }),
        );
        this.flowConnectionData$ = triggerWithInitial$.pipe(
            tap(() => {
                this.getPageFromUrl();
            }),
            switchMap((params) =>
                polling$.pipe(
                    switchMap(() => {
                        return combineLatest([
                            this.accountService.getAccountListFlows({
                                accountName: this.accountName,
                                page: params.page - 1,
                                perPageTable: this.TABLE_FLOW_RUNS_PER_PAGE,
                                perPageTiles: this.WIDGET_FLOW_RUNS_PER_PAGE,
                                filters: this.setAccountFilters({
                                    byProcessType: null,
                                    byStatus: params.filterByStatus,
                                    byInitiator: params.filterByInitiator,
                                    byDatasetIds: params.datasetsIds ?? [],
                                }),
                            }),
                            of([this.loggedUser]),
                        ]);
                    }),
                ),
            ),
            tap(() => this.loadingFlowsSubject$.next(false)),
            map(([flowsData, flowInitiators]) => ({
                flowsData,
                flowInitiators,
            })),
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

    private setAccountFilters(filters: AccountFlowFilters): AccountFlowFilters {
        const { byProcessType, byStatus, byInitiator, byDatasetIds } = filters;
        if (byStatus) {
            this.selectedStatusItems = [{ id: byStatus[0], status: byStatus[0] }];
        }
        return {
            byProcessType,
            byStatus,
            byInitiator,
            byDatasetIds,
        };
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
        this.updateFilters();
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
        this.updateFilters();
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

    private updateFilters(): void {
        this.loadingFlowsSubject$.next(true);
        this.fetchTrigger$.next({
            page: this.currentPage,
            filterByStatus: this.filterByStatus,
            filterByInitiator: this.filterInitiator,
            datasetsIds: this.selectedDatasetItems.map((x) => x.id),
        });
    }
}
