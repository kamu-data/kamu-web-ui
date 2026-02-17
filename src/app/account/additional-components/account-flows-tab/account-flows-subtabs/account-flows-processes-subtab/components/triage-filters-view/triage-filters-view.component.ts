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

import { FlowProcessEffectiveState, OrderingDirection } from "@api/kamu.graphql.interface";

import {
    DashboardFiltersOptions,
    ORDER_BY_FIELD_LIST_TRIAGE,
    RANGE_LAST_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { lastTimeRangeHelper } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

@Component({
    selector: "app-triage-filters-view",
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
    templateUrl: "./triage-filters-view.component.html",
    styleUrls: ["./triage-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriageFiltersViewComponent implements OnInit {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;
    @Output() public applyFilterEmitter = new EventEmitter<void>();

    public readonly RANGE_LAST_ATTEMPT_LIST = RANGE_LAST_ATTEMPT_LIST;
    public readonly ORDER_BY_FIELD_LIST_TRIAGE = ORDER_BY_FIELD_LIST_TRIAGE;

    public ngOnInit(): void {
        this.dashboardFilters.selectedFlowProcessStates = [
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.StoppedAuto,
        ];
    }

    public get currentDateTime(): string {
        return new Date().toISOString();
    }

    public get orderDirection(): OrderingDirection {
        return this.dashboardFilters.selectedOrderDirection ? OrderingDirection.Desc : OrderingDirection.Asc;
    }

    public onChangeLastAttemptFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
        this.applyFilterEmitter.next();
    }

    public onChangeLastFailureFilter(): void {
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
        this.applyFilterEmitter.next();
    }

    public onQuickRangeLastFailure(e: RangeLastAttemptOption): void {
        this.dashboardFilters.lastFailureDate = lastTimeRangeHelper(e.value);
        this.applyFilterEmitter.next();
    }

    public clearLastFailureControl(): void {
        this.dashboardFilters.lastFailureDate = undefined;
        this.dashboardFilters.selectedQuickRangeLastFailure = undefined;
        this.applyFilterEmitter.next();
    }

    public onDirectionToggle(): void {
        this.applyFilterEmitter.next();
    }
}
