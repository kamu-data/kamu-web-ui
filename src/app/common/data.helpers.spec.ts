import timekeeper from 'timekeeper';
import { dataSize, relativeTime } from "./data.helpers";

describe("Relative time helper", () => {

    const FROZEN_TIME = new Date("2022-10-01 12:00:00");
    const TEN_SEC_AGO = new Date("2022-10-01 11:59:50");
    const ALMOST_MINUTE_AGO = new Date("2022-10-01 11:59:59");
    const MINUTE_AGO = new Date("2022-10-01 11:59:00");
    const TEN_MINUTES_AGO = new Date("2022-10-01 11:50:00");
    const HOUR_AGO = new Date("2022-10-01 11:00:00");
    const FIVE_HOURS_AGO = new Date("2022-10-01 07:00:00")
    const DAY_AGO = new Date("2022-09-30 12:00:00");
    const TWO_DAYS_AGO = new Date("2022-09-29 12:00:00");
    const THREE_DAYS_AGO = new Date("2022-09-28 12:00:00");
    const WEEK_AGO = new Date("2022-09-24 12:00:00");
    const EIGHT_DAYS_AGO = new Date("2022-09-23 12:00:00");
    const MONTH_AGO = new Date("2022-09-01 12:00:00");
    const YEAR_AGO = new Date("2021-10-03 12:00:00");

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    })

    async function testRelativeTime(
        expectedResult: string,
        date: Date, 
        threshold? : moment.argThresholdOpts, 
    ): Promise<void> {
        await expect(relativeTime(date.toISOString(), threshold)).toBe(expectedResult);
    }

    [
        {
            date: FROZEN_TIME, 
            expectedResult: "a few seconds ago"
        },
        {
            date: TEN_SEC_AGO, 
            expectedResult: "a few seconds ago"
        },
        {
            date: ALMOST_MINUTE_AGO, 
            expectedResult: "a few seconds ago"
        },
        {
            date: MINUTE_AGO, 
            expectedResult: "a minute ago"
        },
        {
            date: TEN_MINUTES_AGO,
            expectedResult: "10 minutes ago"
        },
        {
            date: HOUR_AGO,
            expectedResult: "an hour ago"
        },
        {
            date: FIVE_HOURS_AGO,
            expectedResult: "5 hours ago"
        },
        {
            date: DAY_AGO,
            expectedResult: "a day ago"
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago"
        },
        {
            date: WEEK_AGO,
            expectedResult: "7 days ago"
        },
        {
            date: MONTH_AGO,
            expectedResult: "a month ago"
        },
        {
            date: YEAR_AGO,
            expectedResult: "a year ago"
        },
    ].forEach(({date, expectedResult: expectedResult}) => {
        it("#relativeTime no threshold", async () => {
            await testRelativeTime(expectedResult, date);
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
            expectedResult: "28 Sep 2022"
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022"
        }
    ].forEach(({date, expectedResult}) => {
        it("#relativeTime days threshold", async () => {
            await testRelativeTime(expectedResult, date, {d: 3});
        });
    });

    [
    
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago"
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022"
        },
        {
            date: EIGHT_DAYS_AGO,
            expectedResult: "23 Sep 2022"
        }
    ].forEach(({date, expectedResult}) => {
        it("#relativeTime weeks threshold", async () => {
            await testRelativeTime(expectedResult, date, {w: 1});
        });
    });

    afterAll(() => {
        timekeeper.reset();
    });
});

describe("Size helper", () => {
    [
        {
            size: 0, 
            decimalPlaces: 0,
            expectedResult: "0 B"
        },
        {
            size: 125, 
            decimalPlaces: 0,
            expectedResult: "125 B"
        },
        {
            size: 1023, 
            decimalPlaces: 0,
            expectedResult: "1023 B"
        },
        {
            size: 1024, 
            decimalPlaces: 0,
            expectedResult: "1 KB"
        },
        {
            size: 1536,
            decimalPlaces: 1,
            expectedResult: "1.5 KB"
        },
        {
            size: 1024 * 1023,
            decimalPlaces: 0,
            expectedResult: "1023 KB"
        },
        {
            size: 1024 * 1024 - 1,
            decimalPlaces: 0,
            expectedResult: "1 MB"
        },          
        {
            size: 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB"
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 1,
            expectedResult: "1.5 MB"
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 MB"
        },
        {
            size: 1.49 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB"
        },               
        {
            size: 2 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 GB"
        },
        {
            size: 13 * 1024 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "13 TB"
        },                       
    ].forEach(({size, decimalPlaces, expectedResult}) => {
        it("#dataSize", async () => {
            await expect(dataSize(size, decimalPlaces)).toBe(expectedResult);
        });
    });
});
