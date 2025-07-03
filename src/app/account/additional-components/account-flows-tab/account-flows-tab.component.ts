/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from "@angular/core";
import { combineLatest, map, of, switchMap, timer } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
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
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { FlowsTableComponent } from "../../../dataset-flow/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "../../../dataset-flow/tile-base-widget/tile-base-widget.component";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, AsyncPipe } from "@angular/common";

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

        //-----//
        FlowsTableComponent,
        TileBaseWidgetComponent,
        PaginationComponent,
    ],
})
export class AccountFlowsTabComponent extends FlowsTableProcessingBaseComponent implements OnInit {
    public readonly DISPLAY_COLUMNS = ["description", "information", "creator", "dataset", "options"];

    private readonly accountService = inject(AccountService);
    private readonly loggedUserService = inject(LoggedUserService);
    private readonly ngZone = inject(NgZone);

    public nodes: FlowSummaryDataFragment[] = [];
    public searchByDataset: DatasetBasicsFragment[] = [];
    public filters: MaybeNull<FlowsTableFiltersOptions>;

    public ngOnInit(): void {
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
                        accountName: this.loggedUser.accountName,
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
                this.navigationService.navigateToOwnerView(this.loggedUser.accountName, AccountTabs.FLOWS, page),
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
}
