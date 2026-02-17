/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { stripSecondsFromDateToISOString } from "@common/helpers/data.helpers";
import {
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessOrderField,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";

import {
    DashboardFiltersOptions,
    ProcessCardFilterMode,
} from "../additional-components/account-flows-tab/account-flows-tab.types";

@Injectable({
    providedIn: "root",
})
export class AccountFlowsFiltersService {
    private initialFilters: DashboardFiltersOptions = {
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
        isFirstInitialization: false,
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

    public setFlowProcessFilters(mode: ProcessCardFilterMode): FlowProcessFilters {
        switch (mode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY: {
                this.updateFilters({
                    selectedOrderField: FlowProcessOrderField.LastAttemptAt,
                    toFilterDate: this.currentFiltersSnapshot.toFilterDate ?? new Date(),
                });
                const sixHoursAgoDate = new Date();
                sixHoursAgoDate.setHours(sixHoursAgoDate.getHours() - 6);
                if (!this.currentFiltersSnapshot.fromFilterDate && this.currentFiltersSnapshot.isFirstInitialization) {
                    this.updateFilters({ fromFilterDate: sixHoursAgoDate });
                }

                return {
                    effectiveStateIn: this.currentFiltersSnapshot.selectedFlowProcessStates.length
                        ? this.currentFiltersSnapshot.selectedFlowProcessStates
                        : this.initialProcessFilters,

                    lastAttemptBetween:
                        this.currentFiltersSnapshot.toFilterDate && this.currentFiltersSnapshot.fromFilterDate
                            ? {
                                  start: this.currentFiltersSnapshot.fromFilterDate
                                      ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.fromFilterDate)
                                      : stripSecondsFromDateToISOString(sixHoursAgoDate),
                                  end: stripSecondsFromDateToISOString(this.currentFiltersSnapshot.toFilterDate),
                              }
                            : undefined,
                };
            }
            case ProcessCardFilterMode.TRIAGE: {
                this.updateFilters({
                    selectedOrderField:
                        this.currentFiltersSnapshot.selectedOrderField ?? FlowProcessOrderField.LastFailureAt,
                    minConsecutiveFailures:
                        this.currentFiltersSnapshot.minConsecutiveFailures > 1
                            ? this.currentFiltersSnapshot.minConsecutiveFailures
                            : 1,
                });

                return {
                    effectiveStateIn: this.currentFiltersSnapshot.selectedFlowProcessStates.length
                        ? this.currentFiltersSnapshot.selectedFlowProcessStates
                        : [FlowProcessEffectiveState.StoppedAuto, FlowProcessEffectiveState.Failing],
                    lastFailureSince: this.currentFiltersSnapshot.lastFailureDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.lastFailureDate)
                        : undefined,
                    minConsecutiveFailures: this.currentFiltersSnapshot.minConsecutiveFailures,
                };
            }
            case ProcessCardFilterMode.UPCOMING_SCHEDULED: {
                this.updateFilters({
                    selectedOrderField: FlowProcessOrderField.NextPlannedAt,
                    selectedOrderDirection: false,
                });

                return {
                    effectiveStateIn: this.currentFiltersSnapshot.selectedFlowProcessStates.length
                        ? this.currentFiltersSnapshot.selectedFlowProcessStates
                        : [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
                    nextPlannedBefore: this.currentFiltersSnapshot.nextPlannedBeforeDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.nextPlannedBeforeDate)
                        : undefined,
                    nextPlannedAfter: this.currentFiltersSnapshot.nextPlannedAfterDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.nextPlannedAfterDate)
                        : stripSecondsFromDateToISOString(new Date()),
                };
            }
            case ProcessCardFilterMode.PAUSED: {
                this.updateFilters({
                    selectedOrderDirection: true,
                    selectedFlowProcessStates: [FlowProcessEffectiveState.PausedManual],
                });
                return {
                    effectiveStateIn: [FlowProcessEffectiveState.PausedManual],
                };
            }
            case ProcessCardFilterMode.CUSTOM: {
                return {
                    effectiveStateIn: this.currentFiltersSnapshot.selectedFlowProcessStates.length
                        ? this.currentFiltersSnapshot.selectedFlowProcessStates
                        : this.initialProcessFilters,
                    lastAttemptBetween:
                        this.currentFiltersSnapshot.fromFilterDate && this.currentFiltersSnapshot.toFilterDate
                            ? {
                                  start: stripSecondsFromDateToISOString(this.currentFiltersSnapshot.fromFilterDate),
                                  end: stripSecondsFromDateToISOString(this.currentFiltersSnapshot.toFilterDate),
                              }
                            : undefined,
                    minConsecutiveFailures: this.currentFiltersSnapshot.minConsecutiveFailures,
                    lastFailureSince: this.currentFiltersSnapshot.lastFailureDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.lastFailureDate)
                        : undefined,
                    nextPlannedBefore: this.currentFiltersSnapshot.nextPlannedBeforeDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.nextPlannedBeforeDate)
                        : undefined,
                    nextPlannedAfter: this.currentFiltersSnapshot.nextPlannedAfterDate
                        ? stripSecondsFromDateToISOString(this.currentFiltersSnapshot.nextPlannedAfterDate)
                        : undefined,
                };
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown filters mode");
        }
    }

    public resetFilters(mode: ProcessCardFilterMode): void {
        this.updateFilters({
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
            minConsecutiveFailures: mode === ProcessCardFilterMode.TRIAGE ? 1 : 0,
            isFirstInitialization: false,
        });
    }

    public updateFilters(changes: Partial<DashboardFiltersOptions>): void {
        const updatedFilters = { ...this.currentFiltersSnapshot, ...changes };
        this.filtersSubject$.next(updatedFilters);
    }
}
