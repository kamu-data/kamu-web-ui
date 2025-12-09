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
    FLOW_PROCESS_STATE_LIST_TRIAGE,
    ORDER_BY_FIELD_LIST_TRIAGE,
    RANGE_LAST_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "../../../../account-flows-tab.types";
import { lastTimeRangeHelper } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { OrderingDirection } from "src/app/api/kamu.graphql.interface";
import { FlowProcessStatusListComponent } from "../common/flow-process-status-list/flow-process-status-list.component";

@Component({
    selector: "app-triage-filters-view",
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
    templateUrl: "./triage-filters-view.component.html",
    styleUrls: ["./triage-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageFiltersViewComponent {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;

    public readonly RANGE_LAST_ATTEMPT_LIST = RANGE_LAST_ATTEMPT_LIST;
    public readonly ORDER_BY_FIELD_LIST_TRIAGE = ORDER_BY_FIELD_LIST_TRIAGE;
    public readonly FLOW_PROCESS_STATE_LIST_TRIAGE = FLOW_PROCESS_STATE_LIST_TRIAGE;

    public get currentDateTime(): string {
        return new Date().toISOString();
    }

    public get orderDirection(): OrderingDirection {
        return this.dashboardFilters.selectedOrderDirection ? OrderingDirection.Desc : OrderingDirection.Asc;
    }

    public onChangeLastAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
    }

    public onChangeLastFailureFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
    }

    public onQuickRangeLastFailure(e: RangeLastAttemptOption): void {
        this.dashboardFilters.lastFailureDate = lastTimeRangeHelper(e.value);
    }

    public clearLastFailureControl(): void {
        this.dashboardFilters.lastFailureDate = undefined;
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
    }
}
