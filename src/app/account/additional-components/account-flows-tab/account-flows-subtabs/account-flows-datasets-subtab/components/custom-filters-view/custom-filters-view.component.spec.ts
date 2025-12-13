/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomFiltersViewComponent } from "./custom-filters-view.component";
import { RangeLastAttempt } from "../../../../account-flows-tab.types";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("CustomFiltersViewComponent", () => {
    let component: CustomFiltersViewComponent;
    let fixture: ComponentFixture<CustomFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CustomFiltersViewComponent],
        });
        fixture = TestBed.createComponent(CustomFiltersViewComponent);
        component = fixture.componentInstance;
        component.dashboardFilters = component.dashboardFilters = {
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
            applyFilters: false,
        };
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
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        component.onChangeNextAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeNextAttempt).toEqual(undefined);
    });

    it("should check to clear 'from' control", () => {
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-from-control");
        expect(component.dashboardFilters.fromFilterDate).toEqual(undefined);
    });

    it("should check to clear 'to' control", () => {
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-to-control");
        expect(component.dashboardFilters.toFilterDate).toEqual(undefined);
    });

    it("should check clear nextPlannedAfterDate control", () => {
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-after-control");
        expect(component.dashboardFilters.nextPlannedAfterDate).toEqual(undefined);
    });

    it("should check clear nextPlannedBeforeDate control", () => {
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-before-control");
        expect(component.dashboardFilters.nextPlannedBeforeDate).toEqual(undefined);
    });

    it("should check to change quick range last attempt", () => {
        component.dashboardFilters = {
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
            applyFilters: false,
        };
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
        component.dashboardFilters = {
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
            applyFilters: false,
        };
        fixture.detectChanges();
        component.onQuickRangeNextAttempt({
            id: 1,
            label: "Next 5 minutes",
            value: RangeLastAttempt.NEXT_5_MINUTES,
        });
        expect(component.dashboardFilters.nextPlannedAfterDate).toBeDefined();
        expect(component.dashboardFilters.nextPlannedBeforeDate).toBeDefined();
    });
});
