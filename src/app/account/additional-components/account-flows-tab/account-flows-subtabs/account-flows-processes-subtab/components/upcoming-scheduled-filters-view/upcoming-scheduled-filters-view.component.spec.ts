/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import timekeeper from "timekeeper";

import { emitClickOnElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";

import { UpcomingScheduledFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/upcoming-scheduled-filters-view/upcoming-scheduled-filters-view.component";
import { mockDashboardFilters } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.mock";
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
        setComponentInput(fixture, "dashboardFilters", mockDashboardFilters());
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

    it("should render without changing the selected states, which the parent sets for the mode", () => {
        fixture.detectChanges();
        expect(component.dashboardFilters.selectedFlowProcessStates).toEqual([]);
        expect(component.dashboardFilters.isFirstInitialization).toBe(false);
    });

    it("should check clear nextPlannedAfterDate control", () => {
        setComponentInput(
            fixture,
            "dashboardFilters",
            mockDashboardFilters({
                nextPlannedAfterDate: new Date(),
                selectedOrderDirection: false,
            }),
        );
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-after-control");
        expect(component.dashboardFilters.nextPlannedAfterDate).toEqual(undefined);
    });

    it("should check clear nextPlannedBeforeDate control", () => {
        setComponentInput(
            fixture,
            "dashboardFilters",
            mockDashboardFilters({
                nextPlannedBeforeDate: new Date(),
            }),
        );
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "clear-before-control");
        expect(component.dashboardFilters.nextPlannedBeforeDate).toEqual(undefined);
    });

    it("should check to change next attempt filter", () => {
        setComponentInput(
            fixture,
            "dashboardFilters",
            mockDashboardFilters({
                selectedQuickRangeNextAttempt: RangeLastAttempt.NEXT_15_MINUTES,
            }),
        );
        fixture.detectChanges();
        component.onChangeNextAttemptFilter();
        expect(component.dashboardFilters.selectedQuickRangeNextAttempt).toEqual(undefined);
    });

    it("should check to change quick range next attempt", () => {
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
            timekeeper.freeze("2024-03-14T11:30:00+00:00");
        });

        it("should check opening a date picker refreshes the current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            emitClickOnElementByDataTestId(fixture, "nextPlannedAfterDatepicker");

            expect(component.currentDateTime).toEqual("2030-01-02T03:04:05.000Z");
        });

        it("should check a quick range starts at the refreshed current time limit", () => {
            fixture.detectChanges();
            timekeeper.freeze("2030-01-02T03:04:05+00:00");

            component.onQuickRangeNextAttempt({
                id: 1,
                label: "Next 5 minutes",
                value: RangeLastAttempt.NEXT_5_MINUTES,
            });

            expect(component.currentDateTime).toEqual("2030-01-02T03:04:05.000Z");
            expect(component.dashboardFilters.nextPlannedAfterDate?.toISOString()).toEqual(component.currentDateTime);
        });
    });
});
