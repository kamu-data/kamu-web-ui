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
            {
                value: 25,
                expected: 25,
                reason: "above the most a stop policy allows, which a flow that never stops can reach",
            },
            { value: 1.5, expected: 2, reason: "not a whole number" },
            { value: Number.NaN, expected: min, reason: "not a number" },
            { value: null, expected: min, reason: "empty" },
            { value: 0, expected: min, reason: "zero" },
            { value: 1, expected: 1, reason: "one" },
            { value: 7, expected: 7, reason: "in range" },
            { value: 11, expected: 11, reason: "above the most a stop policy allows" },
        ].forEach(({ value, expected, reason }) => {
            it(`should turn ${String(value)}, ${reason}, into ${expected} when the minimum is ${min}`, () => {
                expect(clampConsecutiveFailures(value, min)).toBe(expected);
            });
        });
    });
});
