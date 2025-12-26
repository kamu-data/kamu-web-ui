/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgSelectModule } from "@ng-select/ng-select";
import {
    DashboardFiltersOptions,
    FLOW_PROCESS_STATE_LIST,
    ORDER_BY_FIELD_LIST_CUSTOM,
    ORDER_BY_FIELD_LIST_TRIAGE,
    ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED,
    RANGE_LAST_ATTEMPT_LIST,
    RANGE_NEXT_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "../../../../account-flows-tab.types";
import { FlowProcessEffectiveState, OrderingDirection } from "src/app/api/kamu.graphql.interface";
import {
    lastTimeRangeHelper,
    nextTimeRangeHelper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

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
    ],
    templateUrl: "./custom-filters-view.component.html",
    styleUrls: ["./custom-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFiltersViewComponent implements OnInit {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;
    @Output() public applyFilterEmitter = new EventEmitter<void>();

    public readonly ORDER_BY_FIELD_LIST_CUSTOM = ORDER_BY_FIELD_LIST_CUSTOM;
    public readonly ORDER_BY_FIELD_LIST_TRIAGE = ORDER_BY_FIELD_LIST_TRIAGE;
    public readonly ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED = ORDER_BY_FIELD_LIST_UPCOMING_SCHEDULED;
    public readonly RANGE_LAST_ATTEMPT_LIST = RANGE_LAST_ATTEMPT_LIST;
    public readonly RANGE_NEXT_ATTEMPT_LIST = RANGE_NEXT_ATTEMPT_LIST;

    public readonly FLOW_PROCESS_STATE_LIST = FLOW_PROCESS_STATE_LIST;

    public ngOnInit(): void {
        this.dashboardFilters.selectedFlowProcessStates = [
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
            FlowProcessEffectiveState.StoppedAuto,
        ];
    }

    public onChangeLastAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
        this.applyFilterEmitter.next();
    }

    public onChangeLastFailureFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
        this.applyFilterEmitter.next();
    }

    public onChangeNextAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
        this.applyFilterEmitter.next();
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
        this.applyFilterEmitter.next();
    }

    public clearToControl(): void {
        this.dashboardFilters.toFilterDate = undefined;
        this.dashboardFilters.isFirstInitialization = false;
        this.applyFilterEmitter.next();
    }

    public clearLastFailureControl(): void {
        this.dashboardFilters.lastFailureDate = undefined;
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
        this.applyFilterEmitter.next();
    }

    public clearAfterControl(): void {
        this.dashboardFilters.nextPlannedAfterDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
        this.applyFilterEmitter.next();
    }

    public clearBeforeControl(): void {
        this.dashboardFilters.nextPlannedBeforeDate = undefined;
        this.dashboardFilters.selectedQuickRangeNextAttempt = undefined;
        this.applyFilterEmitter.next();
    }

    public onQuickRangeLastFailure(e: RangeLastAttemptOption): void {
        this.dashboardFilters.lastFailureDate = lastTimeRangeHelper(e.value);
        this.applyFilterEmitter.next();
    }

    public onQuickRangeNextAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.nextPlannedAfterDate = new Date();
        this.dashboardFilters.nextPlannedBeforeDate = nextTimeRangeHelper(e.value);
        this.applyFilterEmitter.next();
    }

    public onQuickRangeLastAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.fromFilterDate = lastTimeRangeHelper(e.value);
        this.dashboardFilters.toFilterDate = new Date();
        this.applyFilterEmitter.next();
    }

    public onDirectionToggle(): void {
        this.applyFilterEmitter.next();
    }
}
