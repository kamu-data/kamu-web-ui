/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import timekeeper from "timekeeper";
import { DisplayTimeComponent } from "./display-time.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("DisplayTimeComponent", () => {
    let component: DisplayTimeComponent;
    let fixture: ComponentFixture<DisplayTimeComponent>;
    const FROZEN_TIME = new Date("2022-10-01 12:00:00");
    const TEN_SEC_AGO = new Date("2022-10-01 11:59:50");
    const ALMOST_MINUTE_AGO = new Date("2022-10-01 11:59:59");
    const MINUTE_AGO = new Date("2022-10-01 11:59:00");
    const TEN_MINUTES_AGO = new Date("2022-10-01 11:50:00");
    const HOUR_AGO = new Date("2022-10-01 11:00:00");
    const FIVE_HOURS_AGO = new Date("2022-10-01 07:00:00");
    const DAY_AGO = new Date("2022-09-30 12:00:00");
    const TWO_DAYS_AGO = new Date("2022-09-29 12:00:00");
    const THREE_DAYS_AGO = new Date("2022-09-28 12:00:00");
    const WEEK_AGO = new Date("2022-09-24 12:00:00");
    const EIGHT_DAYS_AGO = new Date("2022-09-23 12:00:00");
    const MONTH_AGO = new Date("2022-09-01 12:00:00");
    const YEAR_AGO = new Date("2021-10-03 12:00:00");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [SharedTestModule, DisplayTimeComponent],
}).compileComponents();

        fixture = TestBed.createComponent(DisplayTimeComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    function testRelativeTime(expectedResult: string, date: Date): void {
        component.data = date.toISOString();
        fixture.detectChanges();

        expect(component.relativeTime).toBe(expectedResult);
    }

    [
        {
            date: FROZEN_TIME,
            expectedResult: "0 seconds ago",
        },
        {
            date: TEN_SEC_AGO,
            expectedResult: "10 seconds ago",
        },
        {
            date: ALMOST_MINUTE_AGO,
            expectedResult: "1 second ago",
        },
        {
            date: MINUTE_AGO,
            expectedResult: "1 minute ago",
        },
        {
            date: TEN_MINUTES_AGO,
            expectedResult: "10 minutes ago",
        },
        {
            date: HOUR_AGO,
            expectedResult: "1 hour ago",
        },
        {
            date: FIVE_HOURS_AGO,
            expectedResult: "5 hours ago",
        },
        {
            date: DAY_AGO,
            expectedResult: "1 day ago",
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "7 days ago",
        },
        {
            date: MONTH_AGO,
            expectedResult: "1 month ago",
        },
        {
            date: YEAR_AGO,
            expectedResult: "1 year ago",
        },
    ].forEach(({ date, expectedResult: expectedResult }) => {
        it("#relativeTime no threshold", () => {
            testRelativeTime(expectedResult, date);
        });
    });

    [
        {
            date: DAY_AGO,
            expectedResult: "1 day ago",
        },
        {
            date: TWO_DAYS_AGO,
            expectedResult: "2 days ago",
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "7 days ago",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime days threshold", () => {
            testRelativeTime(expectedResult, date);
        });
    });

    [
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "7 days ago",
        },
        {
            date: EIGHT_DAYS_AGO,
            expectedResult: "8 days ago",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime weeks threshold", () => {
            testRelativeTime(expectedResult, date);
        });
    });

    afterAll(() => {
        timekeeper.reset();
    });
});
