/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import timekeeper from "timekeeper";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { TriageFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/triage-filters-view/triage-filters-view.component";
import { mockDashboardFilters } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.mock";
import { RangeLastAttempt } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";

describe("TriageFiltersViewComponent", () => {
    let component: TriageFiltersViewComponent;
    let fixture: ComponentFixture<TriageFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TriageFiltersViewComponent],
        });
        fixture = TestBed.createComponent(TriageFiltersViewComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "dashboardFilters", mockDashboardFilters());
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should render without changing the selected states, which the parent sets for the mode", () => {
        fixture.detectChanges();
        expect(component.dashboardFilters.selectedFlowProcessStates).toEqual([]);
        expect(component.dashboardFilters.isFirstInitialization).toBeFalse();
    });

    it("should check to change last attempt filter", () => {
        setComponentInput(fixture, "dashboardFilters", {
            ...component.dashboardFilters,
            selectedQuickRangeLastAttempt: RangeLastAttempt.LAST_5_MINUTES,
        });
        fixture.detectChanges();
        component.onChangeLastAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeLastAttempt).toBeUndefined();
    });

    it("should check to change last failure filter", () => {
        setComponentInput(fixture, "dashboardFilters", {
            ...component.dashboardFilters,
            selectedQuickRangeLastFailure: RangeLastAttempt.LAST_5_MINUTES,
        });
        fixture.detectChanges();
        component.onChangeLastFailureFilter();
        expect(component.dashboardFilters.selectedQuickRangeLastFailure).toBeUndefined();
    });

    it("should check to change quick range last failure", () => {
        component.onQuickRangeLastFailure({
            id: 1,
            label: "Last 5 minutes",
            value: RangeLastAttempt.LAST_5_MINUTES,
        });
        expect(component.dashboardFilters.lastFailureDate).toBeDefined();
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

    describe("current time limit of the date pickers", () => {
        afterEach(() => {
            timekeeper.reset();
        });

        it("should check opening a date picker refreshes the current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            emitClickOnElementByDataTestId(fixture, "lastFailureDatepicker");

            expect(component.currentDateTime).toEqual("2030-01-02T03:04:05.000Z");
        });

        it("should check a quick range refreshes the current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            component.onQuickRangeLastFailure({
                id: 1,
                label: "Last 5 minutes",
                value: RangeLastAttempt.LAST_5_MINUTES,
            });

            expect(component.currentDateTime).toEqual("2030-01-02T03:04:05.000Z");
        });
    });
});
