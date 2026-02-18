/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { FlowProcessEffectiveState, OrderingDirection } from "@api/kamu.graphql.interface";

import { ProcessCardFilterMode } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";

describe("AccountFlowsFiltersService", () => {
    let service: AccountFlowsFiltersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AccountFlowsFiltersService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.RECENT_ACTIVITY", () => {
        service.updateFilters({
            isFirstInitialization: true,
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.RECENT_ACTIVITY);
        expect(result).toEqual(jasmine.objectContaining({ effectiveStateIn: service.initialProcessFilters }));
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.RECENT_ACTIVITY with statuses", () => {
        service.updateFilters({
            isFirstInitialization: false,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.RECENT_ACTIVITY);
        expect(result).toEqual(jasmine.objectContaining({ effectiveStateIn: [FlowProcessEffectiveState.Active] }));
    });

    it("should check order direction with false", () => {
        service.updateFilters({
            selectedOrderDirection: false,
        });
        expect(service.orderDirection).toEqual(OrderingDirection.Asc);
    });

    it("should check order direction with true", () => {
        service.updateFilters({
            selectedOrderDirection: true,
        });
        expect(service.orderDirection).toEqual(OrderingDirection.Desc);
    });

    it("should check to reset filters", () => {
        service.updateFilters({
            selectedFlowProcessStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
        });
        service.resetFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED);
        expect(service.currentFiltersSnapshot).toEqual({
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
        });
    });

    it("should check to reset filters for rocessCardFilterMode.TRIAGE", () => {
        service.updateFilters({
            selectedFlowProcessStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
        });
        service.resetFilters(ProcessCardFilterMode.TRIAGE);
        expect(service.currentFiltersSnapshot).toEqual({
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
            minConsecutiveFailures: 1,
            isFirstInitialization: false,
        });
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.TRIAGE with statuses", () => {
        service.updateFilters({
            selectedFlowProcessStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.TRIAGE);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.TRIAGE without statuses", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
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
            minConsecutiveFailures: 3,
            isFirstInitialization: false,
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.TRIAGE);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.StoppedAuto, FlowProcessEffectiveState.Failing],
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.UPCOMING_SCHEDULED without statuses", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
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
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.UPCOMING_SCHEDULED with statuses", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.UPCOMING_SCHEDULED);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.Active],
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.PAUSED", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
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
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.PAUSED);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.PausedManual],
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.CUSTOM without statuses", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
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
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.CUSTOM);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: service.initialProcessFilters,
            }),
        );
    });

    it("should check to setFlowProcessFilters with ProcessCardFilterMode.CUSTOM with statuses", () => {
        spyOnProperty(service, "currentFiltersSnapshot", "get").and.returnValue({
            fromFilterDate: new Date(),
            toFilterDate: new Date(),
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.PausedManual],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });
        const result = service.setFlowProcessFilters(ProcessCardFilterMode.CUSTOM);
        expect(result).toEqual(
            jasmine.objectContaining({
                effectiveStateIn: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.PausedManual],
            }),
        );
    });
});
