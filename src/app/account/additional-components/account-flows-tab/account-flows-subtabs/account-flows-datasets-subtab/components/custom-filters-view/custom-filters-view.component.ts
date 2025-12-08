/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgSelectModule } from "@ng-select/ng-select";
import {
    DashboardFiltersOptions,
    FLOW_PROCESS_STATE_LIST,
    FLOW_PROCESS_STATE_LIST_TRIAGE,
    FLOW_PROCESS_STATE_LIST_UPCOMING,
    ORDER_BY_FIELD_LIST_CUSTOM,
    ORDER_BY_FIELD_LIST_TRIAGE,
    ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED,
    RANGE_LAST_ATTEMPT_LIST,
    RANGE_NEXT_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "../../../../account-flows-tab.types";
import { OrderingDirection } from "src/app/api/kamu.graphql.interface";
import {
    lastTimeRangeHelper,
    nextTimeRangeHelper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { FlowProcessStatusListComponent } from "../common/flow-process-status-list/flow-process-status-list.component";

@Component({
    selector: "app-custom-filters-view",
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
    templateUrl: "./custom-filters-view.component.html",
    styleUrls: ["./custom-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFiltersViewComponent {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;

    public readonly ORDER_BY_FIELD_LIST_CUSTOM = ORDER_BY_FIELD_LIST_CUSTOM;
    public readonly ORDER_BY_FIELD_LIST_TRIAGE = ORDER_BY_FIELD_LIST_TRIAGE;
    public readonly ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED = ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED;
    public readonly RANGE_LAST_ATTEMPT_LIST = RANGE_LAST_ATTEMPT_LIST;
    public readonly RANGE_NEXT_ATTEMPT_LIST = RANGE_NEXT_ATTEMPT_LIST;

    public readonly FLOW_PROCESS_STATE_LIST = FLOW_PROCESS_STATE_LIST;
    public readonly FLOW_PROCESS_STATE_LIST_TRIAGE = FLOW_PROCESS_STATE_LIST_TRIAGE;
    public readonly FLOW_PROCESS_STATE_LIST_UPCOMING = FLOW_PROCESS_STATE_LIST_UPCOMING;

    public onChangeLastAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
    }

    public onChangeLastFailureFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
    }

    public onChangeNextAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public get currentDateTime(): string {
        return new Date().toISOString();
    }

    public get orderDirection(): OrderingDirection {
        return this.dashboardFilters.selectedOrderDirection ? OrderingDirection.Desc : OrderingDirection.Asc;
    }

    public clearFromControl(): void {
        this.dashboardFilters.fromFilterDate = undefined;
        this.dashboardFilters.isFirstInitialization = false;
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
    }

    public clearToControl(): void {
        this.dashboardFilters.toFilterDate = undefined;
        this.dashboardFilters.isFirstInitialization = false;
    }

    public clearLastFailureControl(): void {
        this.dashboardFilters.lastFailureDate = undefined;
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
    }

    public clearAfterControl(): void {
        this.dashboardFilters.nextPlannedAfterDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public clearBeforeControl(): void {
        this.dashboardFilters.nextPlannedBeforeDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
    }

    public onQuickRangeLastFailure(e: RangeLastAttemptOption): void {
        this.dashboardFilters.lastFailureDate = lastTimeRangeHelper(e.value);
    }

    public onQuickRangeNextAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.nextPlannedAfterDate = new Date();
        this.dashboardFilters.nextPlannedBeforeDate = nextTimeRangeHelper(e.value);
    }

    public onQuickRangeLastAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.fromFilterDate = lastTimeRangeHelper(e.value);
        this.dashboardFilters.toFilterDate = new Date();
    }
}
