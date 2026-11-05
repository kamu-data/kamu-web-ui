/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { unexpectedValueError } from "@common/helpers/app.helpers";
import { stripSecondsFromDateToISOString } from "@common/helpers/data.helpers";
import {
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessFiltersTimeRange,
    FlowProcessOrderField,
    OrderingDirection,
} from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import {
    DashboardFiltersOptions,
    ORDER_BY_FIELD_LIST_TRIAGE,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import {
    clampConsecutiveFailures,
    MIN_CONSECUTIVE_FAILURES_CUSTOM,
    MIN_CONSECUTIVE_FAILURES_TRIAGE,
} from "src/app/account/services/account-flows-filters.helpers";

@Injectable({
    providedIn: "root",
})
export class AccountFlowsFiltersService {
    private readonly initialFilters: DashboardFiltersOptions = {
        fromFilterDate: undefined,
        toFilterDate: undefined,
        lastFailureDate: undefined,
        nextPlannedBeforeDate: undefined,
        nextPlannedAfterDate: undefined,
        selectedOrderDirection: true,
        selectedOrderField: undefined,
        selectedQuickRangeLastAttempt: undefined,
        selectedQuickRangeLastFailure: undefined,
        selectedQuickRangeNextAttempt: undefined,
        selectedFlowProcessStates: [],
        minConsecutiveFailures: 0,
    };

    private filtersSubject$ = new BehaviorSubject<DashboardFiltersOptions>(this.initialFilters);

    public get currentFiltersSnapshot(): DashboardFiltersOptions {
        return this.filtersSubject$.value;
    }

    public get orderDirection(): OrderingDirection {
        return this.currentFiltersSnapshot.selectedOrderDirection ? OrderingDirection.Desc : OrderingDirection.Asc;
    }

    public get initialProcessFilters(): FlowProcessEffectiveState[] {
        return [
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
            FlowProcessEffectiveState.StoppedAuto,
        ];
    }

    private defaultFlowProcessStates(mode: ProcessCardFilterMode): FlowProcessEffectiveState[] {
        switch (mode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY:
            case ProcessCardFilterMode.CUSTOM:
                return this.initialProcessFilters;
            case ProcessCardFilterMode.TRIAGE:
                return [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto];
            case ProcessCardFilterMode.UPCOMING_SCHEDULED:
                return [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
            case ProcessCardFilterMode.PAUSED:
                return [FlowProcessEffectiveState.PausedManual];
            /* istanbul ignore next */
            default:
                throw unexpectedValueError(mode, "process card filter mode");
        }
    }

    private modeDefaults(mode: ProcessCardFilterMode): Partial<DashboardFiltersOptions> {
        const filters = this.currentFiltersSnapshot;
        switch (mode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY: {
                const sixHoursAgo = new Date();
                sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
                return {
                    selectedOrderField: FlowProcessOrderField.LastAttemptAt,
                    fromFilterDate: filters.fromFilterDate ?? sixHoursAgo,
                };
            }
            case ProcessCardFilterMode.TRIAGE: {
                const orderField = filters.selectedOrderField;
                return {
                    minConsecutiveFailures: clampConsecutiveFailures(
                        filters.minConsecutiveFailures,
                        MIN_CONSECUTIVE_FAILURES_TRIAGE,
                    ),
                    selectedOrderField:
                        orderField && ORDER_BY_FIELD_LIST_TRIAGE.some((option) => option.value === orderField)
                            ? orderField
                            : FlowProcessOrderField.LastFailureAt,
                };
            }
            case ProcessCardFilterMode.UPCOMING_SCHEDULED:
                return { selectedOrderField: FlowProcessOrderField.NextPlannedAt, selectedOrderDirection: false };
            case ProcessCardFilterMode.PAUSED:
                return { selectedOrderDirection: true };
            case ProcessCardFilterMode.CUSTOM:
                return {
                    selectedOrderField: filters.selectedOrderField ?? FlowProcessOrderField.LastAttemptAt,
                    minConsecutiveFailures: clampConsecutiveFailures(
                        filters.minConsecutiveFailures,
                        MIN_CONSECUTIVE_FAILURES_CUSTOM,
                    ),
                };
            /* istanbul ignore next */
            default:
                throw unexpectedValueError(mode, "process card filter mode");
        }
    }

    /**
     * Fills in what the mode shows by default: its states, its order, the last 6 hours of the recent
     * activity mode and the minimum failures of the triage mode, keeping the user's other choices.
     * Call it before the mode's filters render: the views bind these filters, and building a request
     * never changes them.
     */
    public applyModeDefaults(mode: ProcessCardFilterMode): void {
        this.updateFilters({
            selectedFlowProcessStates: this.defaultFlowProcessStates(mode),
            ...this.modeDefaults(mode),
        });
    }

    /** Clears every filter, then applies the defaults of the mode */
    public resetFilters(mode: ProcessCardFilterMode): void {
        this.filtersSubject$.next({ ...this.initialFilters });
        this.applyModeDefaults(mode);
    }

    /** The request filters of the mode, read from the current filters without changing them */
    public flowProcessFilters(mode: ProcessCardFilterMode): FlowProcessFilters {
        const filters = this.currentFiltersSnapshot;
        switch (mode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY:
                return {
                    effectiveStateIn: this.selectedStatesOr(this.initialProcessFilters),
                    lastAttemptBetween: this.lastAttemptBetween(),
                };
            case ProcessCardFilterMode.TRIAGE:
                return {
                    effectiveStateIn: this.selectedStatesOr([
                        FlowProcessEffectiveState.StoppedAuto,
                        FlowProcessEffectiveState.Failing,
                    ]),
                    lastFailureSince: this.isoDate(filters.lastFailureDate),
                    minConsecutiveFailures: clampConsecutiveFailures(
                        filters.minConsecutiveFailures,
                        MIN_CONSECUTIVE_FAILURES_TRIAGE,
                    ),
                };
            case ProcessCardFilterMode.UPCOMING_SCHEDULED:
                return {
                    effectiveStateIn: this.selectedStatesOr([
                        FlowProcessEffectiveState.Active,
                        FlowProcessEffectiveState.Failing,
                    ]),
                    nextPlannedBefore: this.isoDate(filters.nextPlannedBeforeDate),
                    // An empty "after" field means from now on
                    nextPlannedAfter: stripSecondsFromDateToISOString(filters.nextPlannedAfterDate ?? new Date()),
                };
            case ProcessCardFilterMode.PAUSED:
                return {
                    effectiveStateIn: [FlowProcessEffectiveState.PausedManual],
                };
            case ProcessCardFilterMode.CUSTOM:
                return {
                    effectiveStateIn: this.selectedStatesOr(this.initialProcessFilters),
                    lastAttemptBetween: this.lastAttemptBetween(),
                    minConsecutiveFailures: clampConsecutiveFailures(
                        filters.minConsecutiveFailures,
                        MIN_CONSECUTIVE_FAILURES_CUSTOM,
                    ),
                    lastFailureSince: this.isoDate(filters.lastFailureDate),
                    nextPlannedBefore: this.isoDate(filters.nextPlannedBeforeDate),
                    nextPlannedAfter: this.isoDate(filters.nextPlannedAfterDate),
                };
            /* istanbul ignore next */
            default:
                throw unexpectedValueError(mode, "process card filter mode");
        }
    }

    public updateFilters(changes: Partial<DashboardFiltersOptions>): void {
        const updatedFilters = { ...this.currentFiltersSnapshot, ...changes };
        this.filtersSubject$.next(updatedFilters);
    }

    private selectedStatesOr(fallback: FlowProcessEffectiveState[]): FlowProcessEffectiveState[] {
        const selected = this.currentFiltersSnapshot.selectedFlowProcessStates;
        return selected.length ? selected : fallback;
    }

    /**
     * An empty "from" field leaves the range open at the start, an empty "to" field ends it now.
     * Now keeps its seconds: cut to the minute, it would leave out the attempts of the current minute.
     */
    private lastAttemptBetween(): MaybeUndefined<FlowProcessFiltersTimeRange> {
        const { fromFilterDate, toFilterDate } = this.currentFiltersSnapshot;
        if (!fromFilterDate && !toFilterDate) {
            return undefined;
        }
        return {
            start: stripSecondsFromDateToISOString(fromFilterDate ?? new Date(0)),
            end: toFilterDate ? stripSecondsFromDateToISOString(toFilterDate) : new Date().toISOString(),
        };
    }

    private isoDate(date: MaybeUndefined<Date>): MaybeUndefined<string> {
        return date ? stripSecondsFromDateToISOString(date) : undefined;
    }
}
