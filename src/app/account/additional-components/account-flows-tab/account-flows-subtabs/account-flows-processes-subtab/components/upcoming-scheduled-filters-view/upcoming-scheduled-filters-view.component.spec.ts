/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import timekeeper from "timekeeper";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

import { UpcomingScheduledFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/upcoming-scheduled-filters-view/upcoming-scheduled-filters-view.component";
import { RangeLastAttempt } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";

describe("UpcomingScheduledFiltersViewComponent", () => {
    let component: UpcomingScheduledFiltersViewComponent;
    let fixture: ComponentFixture<UpcomingScheduledFiltersViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [UpcomingScheduledFiltersViewComponent],
        });
        fixture = TestBed.createComponent(UpcomingScheduledFiltersViewComponent);
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

    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:30:00+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
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
        };
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-before-control");
        expect(component.dashboardFilters.nextPlannedBeforeDate).toEqual(undefined);
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
        };
        fixture.detectChanges();
        component.onChangeNextAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeNextAttempt).toEqual(undefined);
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
