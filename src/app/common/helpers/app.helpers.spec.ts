import { MaybeNullOrUndefined } from "src/app/common/types/app.types";
import { fakeAsync, flush, tick } from "@angular/core/testing";
import {
    isEqual,
    isNil,
    isNull,
    momentConvertDateToLocalWithFormat,
    promiseWithCatch,
    requireValue,
} from "./app.helpers";
import AppValues from "../values/app.values";
import { subDays } from "date-fns";

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
            date: new Date(),
            format: AppValues.DISPLAY_DATE_FORMAT,
            isTextDate: true,
        });
        expect(result).toEqual("Today");
    });

    it("should convert data to yesterday ", () => {
        const result = momentConvertDateToLocalWithFormat({
            date: subDays(new Date(), 1),
            format: AppValues.DISPLAY_DATE_FORMAT,
            isTextDate: true,
        });
        expect(result).toEqual("Yesterday");
    });

    [
        { testCase: null, expectation: true },
        { testCase: undefined, expectation: true },
        { testCase: { a: 1 }, expectation: false },
    ].forEach((item: { testCase: MaybeNullOrUndefined<object>; expectation: boolean }) => {
        it(`should check isNil method with ${item.testCase?.toString()} `, () => {
            expect(isNil(item.testCase)).toEqual(item.expectation);
        });
    });

    [
        { testCase: null, expectation: true },
        { testCase: undefined, expectation: false },
        { testCase: { a: 1 }, expectation: false },
    ].forEach((item: { testCase: MaybeNullOrUndefined<object>; expectation: boolean }) => {
        it(`should check isNull method with ${item.testCase?.toString()} `, () => {
            expect(isNull(item.testCase)).toEqual(item.expectation);
        });
    });

    [
        { testValue1: { a: 1 }, testValue2: { a: 1 }, expectation: true },
        { testValue1: { a: 1 }, testValue2: { a: 2 }, expectation: false },
        { testValue1: null, testValue2: null, expectation: true },
        { testValue1: "test", testValue2: "test", expectation: true },
        { testValue1: "test", testValue2: 5, expectation: false },
        { testValue1: [1], testValue2: 5, expectation: false },
        { testValue1: [1], testValue2: { a: 1 }, expectation: false },
        { testValue1: undefined, testValue2: undefined, expectation: true },
        { testValue1: [1], testValue2: [1], expectation: true },
        { testValue1: [1], testValue2: [1, 2], expectation: false },
        { testValue1: [{ a: 1 }], testValue2: [{ a: 1 }], expectation: true },
        { testValue1: [{ a: 1 }], testValue2: [{ a: 1, b: 1 }], expectation: false },
        { testValue1: [{ a: 1 }], testValue2: [{ a: 1 }, { b: 1 }], expectation: false },
        { testValue1: [{ a: 1 }], testValue2: [{ b: 1 }], expectation: false },
    ].forEach((item: { testValue1: unknown; testValue2: unknown; expectation: boolean }) => {
        it(`should check isEqual method with test case1 = ${item.testValue1?.toString()} and test case2 = ${item.testValue2?.toString()}`, () => {
            expect(isEqual(item.testValue1, item.testValue2)).toEqual(item.expectation);
        });
    });
});
