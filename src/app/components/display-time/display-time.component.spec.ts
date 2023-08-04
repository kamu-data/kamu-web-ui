import { ComponentFixture, TestBed } from "@angular/core/testing";
import timekeeper from "timekeeper";

import { DisplayTimeComponent } from "./display-time.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

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
            declarations: [DisplayTimeComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    function testRelativeTime(expectedResult: string, date: Date, threshold?: moment.argThresholdOpts): void {
        component.data = date.toISOString();
        component.threshold = threshold;
        expect(component.relativeTime).toBe(expectedResult);
    }

    [
        {
            date: FROZEN_TIME,
            expectedResult: "a few seconds ago",
        },
        {
            date: TEN_SEC_AGO,
            expectedResult: "a few seconds ago",
        },
        {
            date: ALMOST_MINUTE_AGO,
            expectedResult: "a few seconds ago",
        },
        {
            date: MINUTE_AGO,
            expectedResult: "a minute ago",
        },
        {
            date: TEN_MINUTES_AGO,
            expectedResult: "10 minutes ago",
        },
        {
            date: HOUR_AGO,
            expectedResult: "an hour ago",
        },
        {
            date: FIVE_HOURS_AGO,
            expectedResult: "5 hours ago",
        },
        {
            date: DAY_AGO,
            expectedResult: "a day ago",
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
            expectedResult: "a month ago",
        },
        {
            date: YEAR_AGO,
            expectedResult: "a year ago",
        },
    ].forEach(({ date, expectedResult: expectedResult }) => {
        it("#relativeTime no threshold", () => {
            testRelativeTime(expectedResult, date);
        });
    });

    [
        {
            date: DAY_AGO,
            expectedResult: "a day ago",
        },
        {
            date: TWO_DAYS_AGO,
            expectedResult: "2 days ago",
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "28 Sep 2022",
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime days threshold", () => {
            testRelativeTime(expectedResult, date, { d: 3 });
        });
    });

    [
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022",
        },
        {
            date: EIGHT_DAYS_AGO,
            expectedResult: "23 Sep 2022",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime weeks threshold", () => {
            testRelativeTime(expectedResult, date, { w: 1 });
        });
    });

    afterAll(() => {
        timekeeper.reset();
    });
});
