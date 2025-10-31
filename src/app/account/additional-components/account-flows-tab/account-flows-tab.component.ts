/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { combineLatest, map, Observable, of, switchMap, timer } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import {
    AccountFragment,
    DatasetBasicsFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    InitiatorFilterInput,
} from "src/app/api/kamu.graphql.interface";
import { AccountService } from "src/app/account/account.service";
import { AccountTabs } from "../../account.constants";
import { environment } from "src/environments/environment";
import { FlowsTableProcessingBaseComponent } from "src/app/dataset-flow/flows-table/flows-table-processing-base.component";
import { FlowsTableData, FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { FlowsTableComponent } from "../../../dataset-flow/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../../../dataset-flow/tile-base-widget/tile-base-widget.component";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, AsyncPipe } from "@angular/common";
import { ParamMap } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountFlowsNav } from "./account-flows-tab.types";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { AccountFlowsType } from "./resolvers/account-flows.resolver";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        FlowsTableComponent,
        TileBaseWidgetComponent,
        PaginationComponent,
    ],
})
export class AccountFlowsTabComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_FLOWS_KEY) public accountFlowsData: AccountFlowsType;

    public readonly DISPLAY_COLUMNS = ["description", "information", "creator", "dataset", "options"];

    private readonly accountService = inject(AccountService);
    private readonly loggedUserService = inject(LoggedUserService);
    private readonly ngZone = inject(NgZone);

    public flowConnectionData$: Observable<{
        flowsData: FlowsTableData;
        allFlowsPaused?: MaybeUndefined<boolean>;
        flowInitiators: AccountFragment[];
    }>;
    public nodes: FlowSummaryDataFragment[] = [];
    public searchByDataset: DatasetBasicsFragment[] = [];
    public filters: MaybeNull<FlowsTableFiltersOptions>;

    public readonly AccountFlowsNav: typeof AccountFlowsNav = AccountFlowsNav;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public activeStatusNav: FlowStatus = FlowStatus.Finished;

    public ngOnInit(): void {
        this.filterByStatus = this.accountFlowsData.flowGroup;
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage, this.filterByStatus);
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

    public get loggedUser(): AccountFragment {
        return this.loggedUserService.currentlyLoggedInUser;
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(this.loggedUser.accountName, AccountTabs.FLOWS),
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
        this.onSearchByFiltersChange(this.filters);
    }

    public toggleStateAccountFlowConfigs(paused: boolean): void {
        if (!paused) {
            this.accountService.accountPauseFlows(this.loggedUser.accountName).subscribe();
        } else {
            this.accountService.accountResumeFlows(this.loggedUser.accountName).subscribe();
        }
        setTimeout(() => {
            this.refreshFlow();
            this.cdr.detectChanges();
        }, this.TIMEOUT_REFRESH_FLOW);
    }

    public onSearchByFiltersChange(filters: MaybeNull<FlowsTableFiltersOptions>): void {
        this.searchByFilters(filters);
        this.searchByDataset = filters?.datasets ?? [];
        this.filters = filters;
    }

    public get accountName(): string {
        const paramMap: MaybeUndefined<ParamMap> = this.activatedRoute?.parent?.parent?.snapshot.paramMap;
        return paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    }

    public onNavChange(event: NgbNavChangeEvent): void {
        const nextNav = event.nextId as AccountFlowsNav;
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.FLOWS, undefined, nextNav);
    }

    public onNavStatusChange(event: NgbNavChangeEvent): void {
        const nextNav = event.nextId as FlowStatus;
        this.filterByStatus = nextNav;
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            this.accountFlowsData.activeNav,
            nextNav,
        );
        this.getPageFromUrl();
        this.fetchTableData(this.currentPage, this.filterByStatus);
    }
}
