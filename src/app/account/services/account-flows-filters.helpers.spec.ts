/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { clampConsecutiveFailures } from "src/app/account/services/account-flows-filters.helpers";

describe("clampConsecutiveFailures", () => {
    [0, 1].forEach((min) => {
        [
            { value: -3, expected: min, reason: "below the minimum" },
            { value: 25, expected: 10, reason: "above the 10 failures kamu-cli stops at" },
            { value: 1.5, expected: 2, reason: "not a whole number" },
            { value: Number.NaN, expected: min, reason: "not a number" },
            { value: null, expected: min, reason: "empty" },
            { value: 7, expected: 7, reason: "in range" },
        ].forEach(({ value, expected, reason }) => {
            it(`should turn ${String(value)}, ${reason}, into ${expected} when the minimum is ${min}`, () => {
                expect(clampConsecutiveFailures(value, min)).toBe(expected);
            });
        });
    });
});
