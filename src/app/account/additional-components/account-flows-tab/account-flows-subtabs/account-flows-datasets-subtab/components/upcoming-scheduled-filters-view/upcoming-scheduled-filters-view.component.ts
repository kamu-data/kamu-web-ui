/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    DashboardFiltersOptions,
    FLOW_PROCESS_STATE_LIST_UPCOMING,
    RANGE_NEXT_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "../../../../account-flows-tab.types";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgSelectModule } from "@ng-select/ng-select";
import { nextTimeRangeHelper } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { OrderingDirection } from "src/app/api/kamu.graphql.interface";
import { FlowProcessStatusListComponent } from "../common/flow-process-status-list/flow-process-status-list.component";

@Component({
    selector: "app-upcoming-scheduled-filters-view",
    standalone: true,
    imports: [
        //-----//
        FormsModule,

        //-----//
        MatIconModule,
        MatSlideToggleModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,

        //-----//
        FlowProcessStatusListComponent,
    ],
    templateUrl: "./upcoming-scheduled-filters-view.component.html",
    styleUrls: ["./upcoming-scheduled-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingScheduledFiltersViewComponent {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;

    public readonly RANGE_NEXT_ATTEMPT_LIST = RANGE_NEXT_ATTEMPT_LIST;
    public readonly FLOW_PROCESS_STATE_LIST_UPCOMING = FLOW_PROCESS_STATE_LIST_UPCOMING;

    public clearAfterControl(): void {
        this.dashboardFilters.nextPlannedAfterDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public clearBeforeControl(): void {
        this.dashboardFilters.nextPlannedBeforeDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public get currentDateTime(): string {
        return new Date().toISOString();
    }

    public get orderDirection(): OrderingDirection {
        return this.dashboardFilters.selectedOrderDirection ? OrderingDirection.Desc : OrderingDirection.Asc;
    }

    public onChangeNextAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public onQuickRangeNextAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.nextPlannedAfterDate = new Date();
        this.dashboardFilters.nextPlannedBeforeDate = nextTimeRangeHelper(e.value);
    }
}
