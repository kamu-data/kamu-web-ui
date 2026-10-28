/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormArray, FormControl } from "@angular/forms";

import { uniqueItemsValidator, uniqueValueValidator } from "@common/validation/collection.validators";

describe("Collection validators", () => {
    describe("uniqueValueValidator", () => {
        const existing = ["API_KEY", "Token"];

        it("should accept a new value", () => {
            expect(uniqueValueValidator(() => existing)(new FormControl("OTHER"))).toBeNull();
        });

        it("should reject an existing value", () => {
            expect(uniqueValueValidator(() => existing)(new FormControl("API_KEY"))).toEqual({ duplicate: true });
        });

        it("should compare case-sensitively by default", () => {
            expect(uniqueValueValidator(() => existing)(new FormControl("api_key"))).toBeNull();
        });

        it("should compare ignoring case when asked", () => {
            const validator = uniqueValueValidator(() => existing, { caseInsensitive: true });
            expect(validator(new FormControl("api_key"))).toEqual({ duplicate: true });
        });

        it("should read the existing values on every check", () => {
            const values: string[] = [];
            const validator = uniqueValueValidator(() => values);
            expect(validator(new FormControl("A"))).toBeNull();
            values.push("A");
            expect(validator(new FormControl("A"))).toEqual({ duplicate: true });
        });
    });

    describe("uniqueItemsValidator", () => {
        function array(...values: string[]): FormArray<FormControl<string>> {
            return new FormArray(values.map((value) => new FormControl(value, { nonNullable: true })));
        }

        it("should accept distinct items and ignore empty ones", () => {
            const validator = uniqueItemsValidator((item) => String(item.value));
            expect(validator(array("id", "name", "", ""))).toBeNull();
        });

        it("should report the first repeated item", () => {
            const validator = uniqueItemsValidator((item) => String(item.value));
            expect(validator(array("id", "name", "id"))).toEqual({ duplicateItems: { value: "id" } });
        });

        it("should compare ignoring case when asked", () => {
            const validator = uniqueItemsValidator((item) => String(item.value), { caseInsensitive: true });
            expect(validator(array("Id", "id"))).toEqual({ duplicateItems: { value: "id" } });
        });
    });
});
