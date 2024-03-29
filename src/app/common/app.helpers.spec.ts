import { fakeAsync, flush, tick } from "@angular/core/testing";
import moment from "moment";
import { momentConvertDateToLocalWithFormat, promiseWithCatch, requireValue } from "./app.helpers";
import AppValues from "./app.values";

describe("AppHelpers", () => {
    it("should check non-null requireValue", () => {
        expect(requireValue({})).toEqual({});
    });

    it("should check null requireValue", () => {
        expect(() => requireValue(null)).toThrowError();
    });

    it("should check promiseWithCatch with success", () => {
        const consoleErrorSpy = spyOn(console, "error").and.stub();
        const emptyPromise = async () => {
            /* Intentionally empty */
        };
        promiseWithCatch(emptyPromise());
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should check promiseWithCatch with failure", fakeAsync(() => {
        const testError = new Error("test");
        const consoleErrorSpy = spyOn(console, "error").and.stub();
        const failingPromise = async () => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve("foo");
                });
            });
            expect(consoleErrorSpy).not.toHaveBeenCalled();
            throw testError;
        };
        promiseWithCatch(failingPromise());
        tick();

        expect(consoleErrorSpy).toHaveBeenCalledWith(testError);
        flush();
    }));

    it("should convert data to local ", () => {
        const baseDate = new Date(String("2022-08-05T21:19:28.817281255"));
        const result = momentConvertDateToLocalWithFormat({
            date: baseDate,
            format: AppValues.DISPLAY_DATE_FORMAT,
        });
        expect(result).toEqual("05 Aug 2022");
    });

    it("should convert data to today ", () => {
        const result = momentConvertDateToLocalWithFormat({
            date: Date.now(),
            format: AppValues.DISPLAY_DATE_FORMAT,
            isTextDate: true,
        });
        expect(result).toEqual("Today");
    });

    it("should convert data to yesterday ", () => {
        const result = momentConvertDateToLocalWithFormat({
            date: moment().subtract(1, "day").toDate(),
            format: AppValues.DISPLAY_DATE_FORMAT,
            isTextDate: true,
        });
        expect(result).toEqual("Yesterday");
    });
});
