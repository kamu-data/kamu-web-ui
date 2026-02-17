/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecentActivityFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/recent-activity-filters-view/recent-activity-filters-view.component";
import { RangeLastAttempt } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

describe("RecentActivityFiltersViewComponent", () => {
    let component: RecentActivityFiltersViewComponent;
    let fixture: ComponentFixture<RecentActivityFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RecentActivityFiltersViewComponent],
        });
        fixture = TestBed.createComponent(RecentActivityFiltersViewComponent);
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
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-to-control");
        expect(component.dashboardFilters.toFilterDate).toEqual(undefined);
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
});
