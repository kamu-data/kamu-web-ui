/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplaySizePipe } from "@common/pipes/display-size.pipe";

describe("DisplaySizePipe", () => {
    const pipe = new DisplaySizePipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    [
        {
            size: 0,
            decimalPlaces: 0,
            expectedResult: "0 B",
        },
        {
            size: 125,
            decimalPlaces: 0,
            expectedResult: "125 B",
        },
        {
            size: 1023,
            decimalPlaces: 0,
            expectedResult: "1023 B",
        },
        {
            size: 1024,
            decimalPlaces: 0,
            expectedResult: "1 KB",
        },
        {
            size: 1536,
            decimalPlaces: 1,
            expectedResult: "1.5 KB",
        },
        {
            size: 1024 * 1023,
            decimalPlaces: 0,
            expectedResult: "1023 KB",
        },
        {
            size: 1024 * 1024 - 1,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 1,
            expectedResult: "1.5 MB",
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 MB",
        },
        {
            size: 1.49 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 2 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 GB",
        },
        {
            size: 13 * 1024 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "13 TB",
        },
    ].forEach(({ size, decimalPlaces, expectedResult }) => {
        it("#dataSize", () => {
            expect(pipe.transform(size, decimalPlaces)).toBe(expectedResult);
        });
    });
});
