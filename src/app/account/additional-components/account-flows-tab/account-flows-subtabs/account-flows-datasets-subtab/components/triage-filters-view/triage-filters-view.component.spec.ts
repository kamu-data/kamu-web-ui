/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TriageFiltersViewComponent } from "./triage-filters-view.component";
import { RangeLastAttempt } from "../../../../account-flows-tab.types";

describe("TriageFiltersViewComponent", () => {
    let component: TriageFiltersViewComponent;
    let fixture: ComponentFixture<TriageFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TriageFiltersViewComponent],
        });
        fixture = TestBed.createComponent(TriageFiltersViewComponent);
        component = fixture.componentInstance;
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
});
