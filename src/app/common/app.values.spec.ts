import moment from "moment";
import AppValues from "./app.values";

describe("AppValues class helper", () => {
    it("should the first letter be capitalized", async () => {
        const result = AppValues.capitalizeFirstLetter("test");
        await expect(result).toEqual("Test");
    });

    it("should convert data to local ", async () => {
        const baseDate = new Date(
            String("2022-08-05T21:19:28.817281255+00:00"),
        );
        const result = AppValues.momentConverDatetoLocalWithFormat({
            date: baseDate,
            format: AppValues.displayDateFormat,
        });
        await expect(result).toEqual("06 Aug 2022");
    });

    it("should convert data to today ", async () => {
        const result = AppValues.momentConverDatetoLocalWithFormat({
            date: Date.now(),
            format: AppValues.displayDateFormat,
            isTextDate: true,
        });
        await expect(result).toEqual("Today");
    });

    it("should convert data to yesterday ", async () => {
        const result = AppValues.momentConverDatetoLocalWithFormat({
            date: moment().subtract(1, "day").toDate(),
            format: AppValues.displayDateFormat,
            isTextDate: true,
        });
        await expect(result).toEqual("Yesterday");
    });
});
