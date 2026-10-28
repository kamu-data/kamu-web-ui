/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, ValidationErrors } from "@angular/forms";

import { cronValidator } from "@common/validation/cron.validators";
import { MaybeNull } from "@interface/app.types";

describe("Cron expression validator", () => {
    [
        { expression: "* * * * ?", expectedResult: null },
        { expression: "* * * * *", expectedResult: null },
        { expression: "", expectedResult: null },
        {
            expression: "* * *",
            expectedResult: {
                invalidCronExpression:
                    "Cron expression must consist of 5 fields (minute, hour, day of month, month, day of week), but got 3.",
            },
        },
        {
            expression: "0 12 1/5 * ?",
            expectedResult: null,
        },
        { expression: "0 12 ? * ?", expectedResult: null },
        {
            expression: "0 12 * 1/5 ?",
            expectedResult: null,
        },
        { expression: "0 12 * 1-5 ?", expectedResult: null },
        { expression: "0 12 * JAN-SEP ?", expectedResult: null },
        { expression: "0 12 * 1,2 ?", expectedResult: null },
        { expression: "0 12 * FEB ?", expectedResult: null },
        { expression: "0 12 * 2 ?", expectedResult: null },
        {
            expression: "0 12 * 55 ?",
            expectedResult: {
                invalidCronExpression: "Month must be between 1 and 12, but got 55.",
            },
        },
        {
            expression: "0 12 * ,2 ?",
            expectedResult: {
                invalidCronExpression: `Month has invalid format: ",2".`,
            },
        },
        {
            expression: "0 12 * + ?",
            expectedResult: {
                invalidCronExpression: `Month has invalid format: "+".`,
            },
        },
        {
            expression: "0 12-2 * 2 ?",
            expectedResult: { invalidCronExpression: `Hour has invalid range: "12-2".` },
        },
        { expression: "0 12,2 * 2 ?", expectedResult: null },
        { expression: "0 12/2 * 2 ?", expectedResult: null },
        {
            expression: "0 12/2 * # ?",
            expectedResult: {
                invalidCronExpression: `Month has invalid format: "#".`,
            },
        },
        { expression: "0 12,14 * 2 ?", expectedResult: null },
        { expression: "0-10 12 * 2 ?", expectedResult: null },
        { expression: "0 */10 * 2 ?", expectedResult: null },
        { expression: "0 10-10,20 * 2 ?", expectedResult: null },
        {
            expression: "80 10-10,20 * 2 ?",
            expectedResult: {
                invalidCronExpression: `Minute must be between 0 and 59, but got 80.`,
            },
        },
        { expression: "* * 5 * ?", expectedResult: null },
        {
            expression: "* * L * ?",
            expectedResult: {
                invalidCronExpression: `Day of month has invalid value: "L".`,
            },
        },
        { expression: "* * ? * 2", expectedResult: null },
        { expression: "* * 1-3 * ?", expectedResult: null },
        { expression: "* * 1,3 * ?", expectedResult: null },
        { expression: "* * 1/3 * ?", expectedResult: null },
        {
            expression: "* * 100 * ?",
            expectedResult: {
                invalidCronExpression: `Day of month must be between 1 and 31, but got 100.`,
            },
        },
        {
            expression: "* * 1/32 * ?",
            expectedResult: {
                invalidCronExpression: `Day of month step must be between 1 and 31, but got 32.`,
            },
        },
        { expression: "* * 1-10,5 * ?", expectedResult: null },
        { expression: "* * */20 * ?", expectedResult: null },
        { expression: "* * */20 * ?", expectedResult: null },
        { expression: "30 9 ? * MON-FRI", expectedResult: null },
        { expression: "30 9 ? * MON,TUE", expectedResult: null },
        { expression: "30 9 ? * MON", expectedResult: null },
        { expression: "30 9 ? * 1", expectedResult: null },
        { expression: "30 9 ? * 1/2", expectedResult: null },
        { expression: "30 9 ? * *", expectedResult: null },
        { expression: "30 9 ? * 1-2", expectedResult: null },
        { expression: "30 9 ? * 1,2", expectedResult: null },
        {
            expression: "30 9 ? * 1#2",
            expectedResult: {
                invalidCronExpression: `Day of week has invalid format: "1#2".`,
            },
        },
        { expression: "30 9 3 * MON", expectedResult: null },
        // Checked against the backend's `cron` crate, which parses these with a leading seconds field.
        { expression: "0-30/5 * * * *", expectedResult: null },
        { expression: "1-5,10-15/2 * * * *", expectedResult: null },
        { expression: "5/59 * * * *", expectedResult: null },
        { expression: "0-30/59 * * * *", expectedResult: null },
        { expression: "5-5 * * * *", expectedResult: null },
        { expression: "* * * JAN-MAR/2 *", expectedResult: null },
        { expression: "* * * * MON-FRI/2", expectedResult: null },
        { expression: "* * * * mon", expectedResult: null },
        { expression: "* * * * 1/7", expectedResult: null },
        {
            expression: "*/0 * * * *",
            expectedResult: { invalidCronExpression: "Minute step must be between 1 and 59, but got 0." },
        },
        {
            expression: "*/60 * * * *",
            expectedResult: { invalidCronExpression: "Minute step must be between 1 and 59, but got 60." },
        },
        {
            expression: "0-30/0 * * * *",
            expectedResult: { invalidCronExpression: "Minute step must be between 1 and 59, but got 0." },
        },
        {
            expression: "* */24 * * *",
            expectedResult: { invalidCronExpression: "Hour step must be between 1 and 23, but got 24." },
        },
        {
            expression: "0 10-5 * * *",
            expectedResult: { invalidCronExpression: `Hour has invalid range: "10-5".` },
        },
        {
            expression: "* * * MAR-JAN *",
            expectedResult: { invalidCronExpression: `Month has invalid range: "MAR-JAN".` },
        },
        {
            expression: "* * * JAN-FOO *",
            expectedResult: { invalidCronExpression: `Month has invalid range: "JAN-FOO".` },
        },
        {
            expression: "* * * JAN/2 *",
            expectedResult: { invalidCronExpression: `Month has invalid format: "JAN/2".` },
        },
        {
            expression: "* * * MON *",
            expectedResult: { invalidCronExpression: `Month has invalid value: "MON".` },
        },
        {
            expression: "0 12 * * JAN",
            expectedResult: { invalidCronExpression: `Day of week has invalid value: "JAN".` },
        },
        {
            expression: "0 MON * * *",
            expectedResult: { invalidCronExpression: `Hour has invalid value: "MON".` },
        },
        {
            expression: "0 12 * * 0",
            expectedResult: { invalidCronExpression: "Day of week must be between 1 and 7, but got 0." },
        },
        {
            expression: "0 12 * * 8",
            expectedResult: { invalidCronExpression: "Day of week must be between 1 and 7, but got 8." },
        },
    ].forEach((item: { expression: string; expectedResult: MaybeNull<ValidationErrors> }) => {
        it(`should check value with ${item.expression}`, () => {
            const control = new FormControl(item.expression);
            expect(cronValidator(control)).toEqual(item.expectedResult);
        });
    });
});
