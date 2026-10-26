/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import timekeeper from "timekeeper";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { CustomFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/custom-filters-view/custom-filters-view.component";
import {
    DashboardFiltersOptions,
    RangeLastAttempt,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";

describe("CustomFiltersViewComponent", () => {
    let component: CustomFiltersViewComponent;
    let fixture: ComponentFixture<CustomFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomFiltersViewComponent],
        });
        fixture = TestBed.createComponent(CustomFiltersViewComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput("dashboardFilters", {
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
        } satisfies DashboardFiltersOptions);
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should check to change last attempt filter", () => {
        component.dashboardFilters.selectedQuickRangeLastAttempt = RangeLastAttempt.LAST_5_MINUTES;
        fixture.detectChanges();
        component.onChangeLastAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeLastAttempt).toBeUndefined();
    });

    it("should check to change last failure filter", () => {
        component.dashboardFilters.selectedQuickRangeLastFailure = RangeLastAttempt.LAST_5_MINUTES;
        fixture.detectChanges();
        component.onChangeLastFailureFilter();
        expect(component.dashboardFilters.selectedQuickRangeLastFailure).toBeUndefined();
    });

    it("should check to clear last failure control", () => {
        component.onQuickRangeLastFailure({
            id: 1,
            label: "Last 5 minutes",
            value: RangeLastAttempt.LAST_5_MINUTES,
        });
        component.clearLastFailureControl();
        expect(component.dashboardFilters.lastFailureDate).toBeUndefined();
    });

    it("should check to change next attempt filter", () => {
        fixture.componentRef.setInput("dashboardFilters", {
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: RangeLastAttempt.NEXT_15_MINUTES,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        component.onChangeNextAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeNextAttempt).toEqual(undefined);
    });

    it("should check to clear 'from' control", () => {
        fixture.componentRef.setInput("dashboardFilters", {
            fromFilterDate: new Date(),
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: false,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-from-control");
        expect(component.dashboardFilters.fromFilterDate).toEqual(undefined);
    });

    it("should check to clear 'to' control", () => {
        fixture.componentRef.setInput("dashboardFilters", {
            fromFilterDate: undefined,
            toFilterDate: new Date(),
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: false,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-to-control");
        expect(component.dashboardFilters.toFilterDate).toEqual(undefined);
    });

    it("should check clear nextPlannedAfterDate control", () => {
        fixture.componentRef.setInput("dashboardFilters", {
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: false,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-after-control");
        expect(component.dashboardFilters.nextPlannedAfterDate).toEqual(undefined);
    });

    it("should check clear nextPlannedBeforeDate control", () => {
        fixture.componentRef.setInput("dashboardFilters", {
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-before-control");
        expect(component.dashboardFilters.nextPlannedBeforeDate).toEqual(undefined);
    });

    it("should check to change quick range last attempt", () => {
        fixture.componentRef.setInput("dashboardFilters", {
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
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        component.onQuickRangeLastAttempt({
            id: 1,
            label: "Last 5 minutes",
            value: RangeLastAttempt.LAST_5_MINUTES,
        });
        expect(component.dashboardFilters.toFilterDate).toBeDefined();
        expect(component.dashboardFilters.fromFilterDate).toBeDefined();
    });

    it("should check to change quick range next attempt", () => {
        fixture.componentRef.setInput("dashboardFilters", {
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
        } satisfies DashboardFiltersOptions);
        fixture.detectChanges();
        component.onQuickRangeNextAttempt({
            id: 1,
            label: "Next 5 minutes",
            value: RangeLastAttempt.NEXT_5_MINUTES,
        });
        expect(component.dashboardFilters.nextPlannedAfterDate).toBeDefined();
        expect(component.dashboardFilters.nextPlannedBeforeDate).toBeDefined();
    });

    describe("current time limit of the date pickers", () => {
        afterEach(() => {
            timekeeper.reset();
        });

        it("should check opening a date picker refreshes the current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            emitClickOnElementByDataTestId(fixture, "todatepicker");

            expect(component.currentDateTime).toEqual("2030-01-02T03:04:05.000Z");
        });

        it("should check quick ranges keep their dates at the refreshed current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            component.onQuickRangeLastAttempt({
                id: 1,
                label: "Last 5 minutes",
                value: RangeLastAttempt.LAST_5_MINUTES,
            });
            expect(component.dashboardFilters.toFilterDate?.toISOString()).toEqual(component.currentDateTime);

            component.onQuickRangeNextAttempt({
                id: 1,
                label: "Next 5 minutes",
                value: RangeLastAttempt.NEXT_5_MINUTES,
            });
            expect(component.dashboardFilters.nextPlannedAfterDate?.toISOString()).toEqual(component.currentDateTime);

            timekeeper.freeze("2030-01-02T04:00:00+00:00");
            component.onQuickRangeLastFailure({
                id: 1,
                label: "Last 5 minutes",
                value: RangeLastAttempt.LAST_5_MINUTES,
            });
            expect(component.currentDateTime).toEqual("2030-01-02T04:00:00.000Z");
        });
    });
});
