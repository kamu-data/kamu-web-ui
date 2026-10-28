/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    collectionPathFromParam,
    inAppPathFromParam,
    isFlowId,
    isMultihash,
    isOdfName,
    isUuid,
    queryParamValue,
} from "@common/helpers/url-params.helpers";

describe("URL parameter helpers", () => {
    [
        {
            name: "isFlowId",
            check: isFlowId,
            valid: ["0", "42", "+7", "18446744073709551615"],
            invalid: ["", "abc", "-1", "1.5", " 2", "18446744073709551616", "1".repeat(21)],
        },
        {
            name: "isUuid",
            check: isUuid,
            valid: [
                "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a",
                "D20A935E-0CCB-4844-B1BB-F4B5B9B0279A",
                "d20a935e0ccb4844b1bbf4b5b9b0279a",
                "{d20a935e-0ccb-4844-b1bb-f4b5b9b0279a}",
                "urn:uuid:d20a935e-0ccb-4844-b1bb-f4b5b9b0279a",
            ],
            invalid: ["", "not-a-uuid", "d20a935e-0ccb-4844-b1bb-f4b5b9b0279", "g20a935e-0ccb-4844-b1bb-f4b5b9b0279a"],
        },
        {
            name: "isOdfName",
            check: isOdfName,
            valid: ["kamu", "com.example.data", "my-dataset", "0xAbC123", "a1.b-2"],
            invalid: ["", "bad_name", "-leading", "trailing-", "double--dash", "a..b", ".dot", "name!", "a/b"],
        },
        {
            name: "isMultihash",
            check: isMultihash,
            valid: [
                "f1620ff7f5beaf16900218a3ac4aae82cdccf764816986c7c739c716cf7dc03112a2f",
                "uEiD_f1vq8WkAIYo6xKrgLNzPdkgWmGx8c5xxbPfcAxEqLw",
                "zQmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            ],
            invalid: ["", "xyz!", "f162", "f16g", "zQm0OIl", "u+/="],
        },
    ].forEach(({ name, check, valid, invalid }) => {
        describe(name, () => {
            valid.forEach((value) => {
                it(`accepts "${value}"`, () => {
                    expect(check(value)).toBe(true);
                });
            });
            invalid.forEach((value) => {
                it(`refuses "${value}"`, () => {
                    expect(check(value)).toBe(false);
                });
            });
        });
    });

    describe("queryParamValue", () => {
        [
            { value: "abc", expected: "abc" },
            { value: "", expected: "" },
            { value: ["first", "second"], expected: "first" },
            { value: [], expected: undefined },
            { value: undefined, expected: undefined },
            { value: null, expected: undefined },
            { value: 42, expected: undefined },
        ].forEach(({ value, expected }) => {
            it(`reads ${JSON.stringify(value)} as ${JSON.stringify(expected)}`, () => {
                expect(queryParamValue(value)).toBe(expected);
            });
        });
    });

    describe("inAppPathFromParam", () => {
        ["/", "/kamu/dataset", "/v/query?sqlQuery=select%201#top"].forEach((path) => {
            it(`keeps the app path "${path}"`, () => {
                expect(inAppPathFromParam(path)).toBe(path);
            });
        });

        ["", null, undefined, "kamu/dataset", "//evil.example", "/\\evil.example", "https://evil.example"].forEach(
            (param) => {
                it(`refuses ${JSON.stringify(param)}`, () => {
                    expect(inAppPathFromParam(param)).toBeUndefined();
                });
            },
        );
    });

    describe("collectionPathFromParam", () => {
        [
            { param: "/", expected: "/" },
            { param: "/docs", expected: "/docs" },
            { param: "/docs/2024/", expected: "/docs/2024" },
            { param: "//docs//2024", expected: "/docs/2024" },
            { param: "docs", expected: "/" },
            { param: "", expected: "/" },
            { param: null, expected: "/" },
            { param: undefined, expected: "/" },
        ].forEach(({ param, expected }) => {
            it(`reads ${JSON.stringify(param)} as "${expected}"`, () => {
                expect(collectionPathFromParam(param)).toBe(expected);
            });
        });
    });
});
