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

import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgSelectModule } from "@ng-select/ng-select";

import { MY_MOMENT_FORMATS } from "@common/helpers/data.helpers";
import { FlowProcessEffectiveState, OrderingDirection } from "@api/kamu.graphql.interface";

import {
    DashboardFiltersOptions,
    RANGE_LAST_ATTEMPT_LIST,
    RangeLastAttemptOption,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { lastTimeRangeHelper } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

@Component({
    selector: "app-recent-activity-filters-view",
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
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
    templateUrl: "./recent-activity-filters-view.component.html",
    styleUrls: ["./recent-activity-filters-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityFiltersViewComponent implements OnInit {
    @Input({ required: true }) public dashboardFilters: DashboardFiltersOptions;
    @Output() public applyFilterEmitter = new EventEmitter<void>();

    public readonly RANGE_LAST_ATTEMPT_LIST = RANGE_LAST_ATTEMPT_LIST;

    public ngOnInit(): void {
        this.dashboardFilters.isFirstInitialization = true;
        this.dashboardFilters.selectedFlowProcessStates = [
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
            FlowProcessEffectiveState.StoppedAuto,
        ];
    }

    public onDirectionToggle(): void {
        this.applyFilterEmitter.next();
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

    public clearFromControl(): void {
        this.dashboardFilters.fromFilterDate = undefined;
        this.dashboardFilters.isFirstInitialization = false;
        this.dashboardFilters.selectedQuickRangeLastAttempt = undefined;
    }

    public clearToControl(): void {
        this.dashboardFilters.toFilterDate = undefined;
        this.dashboardFilters.isFirstInitialization = false;
    }

    public onQuickRangeLastAttempt(e: RangeLastAttemptOption): void {
        this.dashboardFilters.fromFilterDate = lastTimeRangeHelper(e.value);
        this.dashboardFilters.toFilterDate = new Date();
        this.applyFilterEmitter.next();
    }
}
