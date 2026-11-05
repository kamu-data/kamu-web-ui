/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import timekeeper from "timekeeper";

import { FlowProcessEffectiveState, FlowProcessOrderField, OrderingDirection } from "@api/kamu.graphql.interface";

import { mockDashboardFilters } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.mock";
import { ProcessCardFilterMode } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";

describe("AccountFlowsFiltersService", () => {
    let service: AccountFlowsFiltersService;

    const NOW = "2024-03-14T11:22:29+00:00";
    const NOW_ISO = "2024-03-14T11:22:00.000Z";
    const SIX_HOURS_AGO = new Date("2024-03-14T05:22:29+00:00");

    beforeEach(() => {
        timekeeper.freeze(NOW);
        TestBed.configureTestingModule({});
        service = TestBed.inject(AccountFlowsFiltersService);
    });

    afterEach(() => {
        timekeeper.reset();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("mode defaults", () => {
        const cases: {
            mode: ProcessCardFilterMode;
            states: FlowProcessEffectiveState[];
        }[] = [
            {
                mode: ProcessCardFilterMode.RECENT_ACTIVITY,
                states: [
                    FlowProcessEffectiveState.Active,
                    FlowProcessEffectiveState.Failing,
                    FlowProcessEffectiveState.PausedManual,
                    FlowProcessEffectiveState.StoppedAuto,
                ],
            },
            {
                mode: ProcessCardFilterMode.TRIAGE,
                states: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
            },
            {
                mode: ProcessCardFilterMode.UPCOMING_SCHEDULED,
                states: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
            },
            { mode: ProcessCardFilterMode.PAUSED, states: [FlowProcessEffectiveState.PausedManual] },
            {
                mode: ProcessCardFilterMode.CUSTOM,
                states: [
                    FlowProcessEffectiveState.Active,
                    FlowProcessEffectiveState.Failing,
                    FlowProcessEffectiveState.PausedManual,
                    FlowProcessEffectiveState.StoppedAuto,
                ],
            },
        ];

        cases.forEach(({ mode, states }) => {
            it(`should select the default states of the ${mode} mode`, () => {
                service.applyModeDefaults(mode);
                expect(service.currentFiltersSnapshot.selectedFlowProcessStates).toEqual(states);
            });

            it(`should leave the filters of the ${mode} mode as they are when building a request`, () => {
                service.applyModeDefaults(mode);
                const shown = service.currentFiltersSnapshot;

                service.flowProcessFilters(mode);

                expect(service.currentFiltersSnapshot).toBe(shown);
            });
        });

        it("should show the last 6 hours of activity, ordered by last attempt, in the recent activity mode", () => {
            service.applyModeDefaults(ProcessCardFilterMode.RECENT_ACTIVITY);

            expect(service.currentFiltersSnapshot.fromFilterDate).toEqual(SIX_HOURS_AGO);
            expect(service.currentFiltersSnapshot.toFilterDate).toBeUndefined();
            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.LastAttemptAt);
        });

        it("should keep a start of the time window that the user chose in the recent activity mode", () => {
            const fromFilterDate = new Date("2024-03-14T10:00:00+00:00");
            service.updateFilters({ fromFilterDate });

            service.applyModeDefaults(ProcessCardFilterMode.RECENT_ACTIVITY);

            expect(service.currentFiltersSnapshot.fromFilterDate).toEqual(fromFilterDate);
        });

        it("should require at least 1 consecutive failure and order by last failure in the triage mode", () => {
            service.applyModeDefaults(ProcessCardFilterMode.TRIAGE);

            expect(service.currentFiltersSnapshot.minConsecutiveFailures).toBe(1);
            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.LastFailureAt);
        });

        it("should keep the failures and the order field that the user chose in the triage mode", () => {
            service.updateFilters({
                minConsecutiveFailures: 2,
                selectedOrderField: FlowProcessOrderField.ConsecutiveFailures,
            });

            service.applyModeDefaults(ProcessCardFilterMode.TRIAGE);

            expect(service.currentFiltersSnapshot.minConsecutiveFailures).toBe(2);
            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.ConsecutiveFailures);
        });

        it("should replace an order field that the triage mode does not offer", () => {
            service.applyModeDefaults(ProcessCardFilterMode.UPCOMING_SCHEDULED);

            service.applyModeDefaults(ProcessCardFilterMode.TRIAGE);

            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.LastFailureAt);
        });

        it("should order by the next planned run, soonest first, in the upcoming mode", () => {
            service.applyModeDefaults(ProcessCardFilterMode.UPCOMING_SCHEDULED);

            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.NextPlannedAt);
            expect(service.orderDirection).toBe(OrderingDirection.Asc);
        });

        it("should keep the order direction that the user chose in the upcoming mode", () => {
            service.applyModeDefaults(ProcessCardFilterMode.UPCOMING_SCHEDULED);
            service.updateFilters({ selectedOrderDirection: true });

            service.flowProcessFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED);

            expect(service.orderDirection).toBe(OrderingDirection.Desc);
        });

        it("should order the paused mode newest first", () => {
            service.updateFilters({ selectedOrderDirection: false });

            service.applyModeDefaults(ProcessCardFilterMode.PAUSED);

            expect(service.orderDirection).toBe(OrderingDirection.Desc);
        });

        it("should keep the other filters of the mode", () => {
            const lastFailureDate = new Date("2024-03-14T11:00:00+00:00");
            service.updateFilters({ lastFailureDate, minConsecutiveFailures: 2 });

            service.applyModeDefaults(ProcessCardFilterMode.CUSTOM);

            expect(service.currentFiltersSnapshot.lastFailureDate).toEqual(lastFailureDate);
            expect(service.currentFiltersSnapshot.minConsecutiveFailures).toBe(2);
        });
    });

    describe("reset", () => {
        it("should clear the filters and apply the defaults of the upcoming mode", () => {
            service.updateFilters({
                selectedFlowProcessStates: [FlowProcessEffectiveState.PausedManual],
                lastFailureDate: new Date(),
                minConsecutiveFailures: 4,
            });

            service.resetFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED);

            expect(service.currentFiltersSnapshot).toEqual(
                mockDashboardFilters({
                    selectedFlowProcessStates: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
                    selectedOrderField: FlowProcessOrderField.NextPlannedAt,
                    selectedOrderDirection: false,
                }),
            );
        });

        it("should clear the filters and apply the defaults of the triage mode", () => {
            service.updateFilters({ minConsecutiveFailures: 4, selectedOrderField: FlowProcessOrderField.FlowType });

            service.resetFilters(ProcessCardFilterMode.TRIAGE);

            expect(service.currentFiltersSnapshot).toEqual(
                mockDashboardFilters({
                    selectedFlowProcessStates: [
                        FlowProcessEffectiveState.Failing,
                        FlowProcessEffectiveState.StoppedAuto,
                    ],
                    selectedOrderField: FlowProcessOrderField.LastFailureAt,
                    minConsecutiveFailures: 1,
                }),
            );
        });

        it("should select the states the custom mode queries", () => {
            service.updateFilters({ selectedFlowProcessStates: [FlowProcessEffectiveState.PausedManual] });

            service.resetFilters(ProcessCardFilterMode.CUSTOM);

            expect(service.currentFiltersSnapshot.selectedFlowProcessStates).toEqual(service.initialProcessFilters);
            expect(service.currentFiltersSnapshot.selectedOrderField).toBe(FlowProcessOrderField.LastAttemptAt);
            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM).effectiveStateIn).toEqual(
                service.initialProcessFilters,
            );
        });
    });

    describe("request filters", () => {
        it("should query the last 6 hours up to now in the recent activity mode", () => {
            service.applyModeDefaults(ProcessCardFilterMode.RECENT_ACTIVITY);

            expect(service.flowProcessFilters(ProcessCardFilterMode.RECENT_ACTIVITY)).toEqual({
                effectiveStateIn: service.initialProcessFilters,
                lastAttemptBetween: { start: "2024-03-14T05:22:00.000Z", end: "2024-03-14T11:22:29.000Z" },
            });
        });

        it("should query no time window when both of its fields are empty", () => {
            expect(
                service.flowProcessFilters(ProcessCardFilterMode.RECENT_ACTIVITY).lastAttemptBetween,
            ).toBeUndefined();
        });

        it("should query a time window that only ends, from the earliest time", () => {
            service.updateFilters({ toFilterDate: new Date("2024-03-14T10:00:45Z") });

            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM).lastAttemptBetween).toEqual({
                start: "1970-01-01T00:00:00.000Z",
                end: "2024-03-14T10:00:00.000Z",
            });
        });

        it("should query the selected states of the recent activity mode", () => {
            service.updateFilters({ selectedFlowProcessStates: [FlowProcessEffectiveState.Active] });

            expect(service.flowProcessFilters(ProcessCardFilterMode.RECENT_ACTIVITY).effectiveStateIn).toEqual([
                FlowProcessEffectiveState.Active,
            ]);
        });

        it("should query the failing and stopped processes when the triage mode selects no state", () => {
            expect(service.flowProcessFilters(ProcessCardFilterMode.TRIAGE).effectiveStateIn).toEqual([
                FlowProcessEffectiveState.StoppedAuto,
                FlowProcessEffectiveState.Failing,
            ]);
        });

        it("should pass the failure date of a triage filter and query at least 1 failure", () => {
            service.updateFilters({ lastFailureDate: new Date("2024-03-14T11:22:29Z"), minConsecutiveFailures: 0 });

            const result = service.flowProcessFilters(ProcessCardFilterMode.TRIAGE);

            expect(result.lastFailureSince).toBe(NOW_ISO);
            expect(result.minConsecutiveFailures).toBe(1);
        });

        it("should query the active and failing processes planned from now when the upcoming mode has no filters", () => {
            expect(service.flowProcessFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED)).toEqual({
                effectiveStateIn: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
                nextPlannedBefore: undefined,
                nextPlannedAfter: NOW_ISO,
            });
        });

        it("should query the selected states of the upcoming mode", () => {
            service.updateFilters({ selectedFlowProcessStates: [FlowProcessEffectiveState.Active] });

            expect(service.flowProcessFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED).effectiveStateIn).toEqual([
                FlowProcessEffectiveState.Active,
            ]);
        });

        it("should query the paused processes in the paused mode", () => {
            expect(service.flowProcessFilters(ProcessCardFilterMode.PAUSED)).toEqual({
                effectiveStateIn: [FlowProcessEffectiveState.PausedManual],
            });
        });

        it("should query every state when the custom mode selects none", () => {
            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM).effectiveStateIn).toEqual(
                service.initialProcessFilters,
            );
        });

        it("should query more failures than a stop policy allows, which a flow that never stops can reach", () => {
            service.updateFilters({ minConsecutiveFailures: 25 });

            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM).minConsecutiveFailures).toBe(25);
        });

        it("should query a whole number of failures in the custom mode", () => {
            service.updateFilters({ minConsecutiveFailures: 2.6 });

            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM).minConsecutiveFailures).toBe(3);
        });

        it("should pass every date of a custom filter to the query", () => {
            service.updateFilters({
                fromFilterDate: new Date("2024-03-14T05:00:10Z"),
                toFilterDate: new Date("2024-03-14T09:00:10Z"),
                lastFailureDate: new Date("2024-03-14T11:22:29Z"),
                nextPlannedBeforeDate: new Date("2024-03-15T08:00:45Z"),
                nextPlannedAfterDate: new Date("2024-03-13T08:00:45Z"),
            });

            expect(service.flowProcessFilters(ProcessCardFilterMode.CUSTOM)).toEqual(
                expect.objectContaining({
                    lastAttemptBetween: { start: "2024-03-14T05:00:00.000Z", end: "2024-03-14T09:00:00.000Z" },
                    lastFailureSince: NOW_ISO,
                    nextPlannedBefore: "2024-03-15T08:00:00.000Z",
                    nextPlannedAfter: "2024-03-13T08:00:00.000Z",
                }),
            );
        });
    });

    it("should order newest first when the direction is on", () => {
        service.updateFilters({ selectedOrderDirection: true });
        expect(service.orderDirection).toEqual(OrderingDirection.Desc);
    });

    it("should order oldest first when the direction is off", () => {
        service.updateFilters({ selectedOrderDirection: false });
        expect(service.orderDirection).toEqual(OrderingDirection.Asc);
    });
});
