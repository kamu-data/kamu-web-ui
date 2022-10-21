import { fakeAsync, tick } from "@angular/core/testing";
import moment from "moment";
import {
    capitalizeFirstLetter,
    momentConvertDatetoLocalWithFormat,
    promiseWithCatch,
    requireValue,
} from "./app.helpers";
import AppValues from "./app.values";

describe("AppHelpers", () => {
    it("should check non-null requireValue", async () => {
        await expect(requireValue({})).toEqual({});
    });

    it("should check null requireValue", async () => {
        await expect(() => requireValue(null)).toThrowError();
    });

    it("should check promiseWithCatch with success", async () => {
        const consoleErrorSpy = spyOn(console, "error").and.stub();
        const emptyPromise = async () => {
            /* Intentionally empty */
        };
        promiseWithCatch(emptyPromise());
        await expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should check promiseWithCatch with failure", fakeAsync(async () => {
        const consoleErrorSpy = spyOn(console, "error").and.stub();
        const failingPromise = async () => {
            await expect(consoleErrorSpy).not.toHaveBeenCalled();
            throw Error("test");
        };
        promiseWithCatch(failingPromise());
        tick();
        await expect(consoleErrorSpy).toHaveBeenCalled();
    }));

    it("should the first letter be capitalized", async () => {
        const result = capitalizeFirstLetter("test");
        await expect(result).toEqual("Test");
    });

    it("should convert data to local ", async () => {
        const baseDate = new Date(String("2022-08-05T21:19:28.817281255"));
        const result = momentConvertDatetoLocalWithFormat({
            date: baseDate,
            format: AppValues.displayDateFormat,
        });
        await expect(result).toEqual("05 Aug 2022");
    });

    it("should convert data to today ", async () => {
        const result = momentConvertDatetoLocalWithFormat({
            date: Date.now(),
            format: AppValues.displayDateFormat,
            isTextDate: true,
        });
        await expect(result).toEqual("Today");
    });

    it("should convert data to yesterday ", async () => {
        const result = momentConvertDatetoLocalWithFormat({
            date: moment().subtract(1, "day").toDate(),
            format: AppValues.displayDateFormat,
            isTextDate: true,
        });
        await expect(result).toEqual("Yesterday");
    });
});
