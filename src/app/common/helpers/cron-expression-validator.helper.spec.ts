/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { isValidCronExpression } from "./cron-expression-validator.helper";

describe("Cron expression validator", () => {
    [
        { expression: "* * * * ?", expectedResult: true },
        { expression: "* * * * *", expectedResult: true },
        { expression: "", expectedResult: false },
        { expression: "* * *", expectedResult: false },
        { expression: "0 12 1/5 * ?", expectedResult: true },
        { expression: "0 12 ? * ?", expectedResult: false },
        { expression: "0 12 * 1/5 ?", expectedResult: true },
        { expression: "0 12 * 1-5 ?", expectedResult: true },
        { expression: "0 12 * JAN-SEP ?", expectedResult: true },
        { expression: "0 12 * 1,2 ?", expectedResult: true },
        { expression: "0 12 * FEB ?", expectedResult: true },
        { expression: "0 12 * 2 ?", expectedResult: true },
        { expression: "0 12 * 55 ?", expectedResult: false },
        { expression: "0 12 * ,2 ?", expectedResult: false },
        { expression: "0 12 * + ?", expectedResult: false },
        { expression: "0 12-2 * 2 ?", expectedResult: true },
        { expression: "0 12,2 * 2 ?", expectedResult: true },
        { expression: "0 12/2 * 2 ?", expectedResult: true },
        { expression: "0 12/2 * # ?", expectedResult: false },
        { expression: "0 12,14 * 2 ?", expectedResult: true },
        { expression: "0-10 12 * 2 ?", expectedResult: true },
        { expression: "0 */10 * 2 ?", expectedResult: true },
        { expression: "0 10-10,20 * 2 ?", expectedResult: true },
        { expression: "80 10-10,20 * 2 ?", expectedResult: false },
        { expression: "* * 5 * ?", expectedResult: true },
        { expression: "* * L * ?", expectedResult: false },
        { expression: "* * ? * 2", expectedResult: true },
        { expression: "* * 1-3 * ?", expectedResult: true },
        { expression: "* * 1,3 * ?", expectedResult: true },
        { expression: "* * 1/3 * ?", expectedResult: true },
        { expression: "* * 100 * ?", expectedResult: false },
        { expression: "* * 1/44 * ?", expectedResult: false },
        { expression: "* * 1-10,5 * ?", expectedResult: true },
        { expression: "* * */20 * ?", expectedResult: true },
        { expression: "* * */20 * ?", expectedResult: true },
        { expression: "30 9 ? * MON-FRI", expectedResult: true },
        { expression: "30 9 ? * MON,TUE", expectedResult: true },
        { expression: "30 9 ? * MON", expectedResult: true },
        { expression: "30 9 ? * 1", expectedResult: true },
        { expression: "30 9 ? * 1/2", expectedResult: true },
        { expression: "30 9 ? * *", expectedResult: true },
        { expression: "30 9 ? * 1-2", expectedResult: true },
        { expression: "30 9 ? * 1,2", expectedResult: true },
        { expression: "30 9 ? * 1#2", expectedResult: false },
        { expression: "30 9 3 * MON", expectedResult: false },
    ].forEach((item: { expression: string; expectedResult: boolean }) => {
        it(`should check value with ${item.expression}`, () => {
            expect(isValidCronExpression(item.expression)).toEqual(item.expectedResult);
        });
    });
});
