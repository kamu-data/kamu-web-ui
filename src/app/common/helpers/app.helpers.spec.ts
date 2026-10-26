/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, tick } from "@angular/core/testing";

import { BehaviorSubject, NEVER, Subject, throwError } from "rxjs";

import { subDays } from "date-fns";

import {
    addMarkdownRunButton,
    isEqual,
    isNil,
    isNull,
    momentConvertDateToLocalWithFormat,
    promiseWithCatch,
    requireValue,
    trackBusy,
    trackBusyKey,
} from "@common/helpers/app.helpers";
import AppValues from "@common/values/app.values";
import { MaybeNullOrUndefined } from "@interface/app.types";

describe("AppHelpers", () => {
    it("should check non-null requireValue", () => {
        expect(requireValue({})).toEqual({});
    });

    it("should check null requireValue", () => {
        expect(() => requireValue(null)).toThrowError();
    });

    it("should check promiseWithCatch with success", () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const emptyPromise = async () => {
            /* Intentionally empty */
        };
        promiseWithCatch(emptyPromise());
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should check promiseWithCatch with failure", fakeAsync(() => {
        const testError = new Error("test");
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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
        it(`should check isNil method with ${JSON.stringify(item.testCase)} `, () => {
            expect(isNil(item.testCase)).toEqual(item.expectation);
        });
    });

    [
        { testCase: null, expectation: true },
        { testCase: undefined, expectation: false },
        { testCase: { a: 1 }, expectation: false },
    ].forEach((item: { testCase: MaybeNullOrUndefined<object>; expectation: boolean }) => {
        it(`should check isNull method with ${JSON.stringify(item.testCase)} `, () => {
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

    describe("addMarkdownRunButton", () => {
        const RUN_BUTTON_SELECTOR = '[data-test-id="markdown-run-button"]';

        function createMarkdownContainer(): HTMLElement {
            const container = document.createElement("div");
            const pre = document.createElement("pre");
            pre.classList.add("language-sql");
            container.appendChild(pre);
            return container;
        }

        it("should add a Run button only inside the given container", () => {
            const target = createMarkdownContainer();
            const other = createMarkdownContainer();

            addMarkdownRunButton(target, ["select 1"], "/query?sqlQuery");

            const runButtons = target.querySelectorAll<HTMLAnchorElement>(RUN_BUTTON_SELECTOR);
            expect(runButtons.length).toEqual(1);
            expect(runButtons[0].getAttribute("href")).toEqual("/query?sqlQuery=select%201");
            expect(other.querySelectorAll(RUN_BUTTON_SELECTOR).length).toEqual(0);
        });

        it("should not add a second Run button when called again for the same render", () => {
            const target = createMarkdownContainer();

            addMarkdownRunButton(target, ["select 1"], "/query?sqlQuery");
            addMarkdownRunButton(target, ["select 1"], "/query?sqlQuery");

            expect(target.querySelectorAll(RUN_BUTTON_SELECTOR).length).toEqual(1);
        });

        it("should add no Run button without SQL queries", () => {
            const target = createMarkdownContainer();

            addMarkdownRunButton(target, null, "/query?sqlQuery");

            expect(target.querySelectorAll(RUN_BUTTON_SELECTOR).length).toEqual(0);
        });
    });

    describe("trackBusy", () => {
        it("should be busy from the subscription until the source completes", () => {
            const busy$ = new BehaviorSubject<boolean>(false);
            const source$ = new Subject<number>();
            const tracked$ = source$.pipe(trackBusy(busy$));
            expect(busy$.value).toBe(false);

            tracked$.subscribe();
            expect(busy$.value).toBe(true);

            source$.next(1);
            expect(busy$.value).toBe(true);

            source$.complete();
            expect(busy$.value).toBe(false);
        });

        it("should stop being busy when the source errors, passing the error on", () => {
            const busy$ = new BehaviorSubject<boolean>(false);
            let error: unknown;

            throwError(() => new Error("failure"))
                .pipe(trackBusy(busy$))
                .subscribe({ error: (e: unknown) => (error = e) });

            expect(busy$.value).toBe(false);
            expect(error).toEqual(new Error("failure"));
        });

        it("should stop being busy on unsubscribe", () => {
            const busy$ = new BehaviorSubject<boolean>(false);
            const subscription = NEVER.pipe(trackBusy(busy$)).subscribe();
            expect(busy$.value).toBe(true);

            subscription.unsubscribe();
            expect(busy$.value).toBe(false);
        });
    });

    describe("trackBusyKey", () => {
        it("should hold each key until its own source completes", () => {
            const busyKeys$ = new BehaviorSubject<ReadonlySet<string>>(new Set());
            const first$ = new Subject<void>();
            const second$ = new Subject<void>();

            first$.pipe(trackBusyKey(busyKeys$, "first")).subscribe();
            second$.pipe(trackBusyKey(busyKeys$, "second")).subscribe({ error: () => undefined });
            expect([...busyKeys$.value]).toEqual(["first", "second"]);

            first$.complete();
            expect([...busyKeys$.value]).toEqual(["second"]);

            second$.error(new Error("failure"));
            expect([...busyKeys$.value]).toEqual([]);
        });

        it("should emit a new set on each change", () => {
            const busyKeys$ = new BehaviorSubject<ReadonlySet<string>>(new Set());
            const initial = busyKeys$.value;

            NEVER.pipe(trackBusyKey(busyKeys$, "key")).subscribe();

            expect(busyKeys$.value).not.toBe(initial);
            expect(initial.size).toEqual(0);
        });
    });
});
