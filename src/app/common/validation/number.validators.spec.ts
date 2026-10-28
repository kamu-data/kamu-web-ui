/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, ValidationErrors, Validators } from "@angular/forms";

import { integerInRangeValidators, integerValidator, portValidators } from "@common/validation/number.validators";
import { MaybeNull } from "@interface/app.types";

describe("Number validators", () => {
    describe("integerValidator", () => {
        [
            { value: null, expected: null },
            { value: "", expected: null },
            { value: 0, expected: null },
            { value: -3, expected: null },
            { value: 1.5, expected: { integer: true } },
            { value: "2.25", expected: { integer: true } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(integerValidator()(new FormControl(value))).toEqual(expected);
            });
        });
    });

    describe("integerInRangeValidators", () => {
        function check(value: number, min: number, max?: number): MaybeNull<ValidationErrors> {
            return new FormControl(value, Validators.compose(integerInRangeValidators(min, max))).errors;
        }

        it("should accept the bounds", () => {
            expect(check(1, 1, 10)).toBeNull();
            expect(check(10, 1, 10)).toBeNull();
        });

        it("should reject values outside the bounds", () => {
            expect(check(0, 1, 10)).toEqual({ min: { min: 1, actual: 0 } });
            expect(check(11, 1, 10)).toEqual({ max: { max: 10, actual: 11 } });
        });

        it("should leave the upper bound open when it is not given", () => {
            expect(check(1_000_000, 1)).toBeNull();
        });
    });

    describe("portValidators", () => {
        function check(value: number): MaybeNull<ValidationErrors> {
            return new FormControl(value, Validators.compose(portValidators())).errors;
        }

        [1, 1883, 65535].forEach((port) => {
            it(`should accept ${port}`, () => {
                expect(check(port)).toBeNull();
            });
        });

        it("should reject ports outside 1..65535 and fractions", () => {
            expect(check(-5)).toEqual({ min: { min: 1, actual: -5 } });
            expect(check(0)).toEqual({ min: { min: 1, actual: 0 } });
            expect(check(70000)).toEqual({ max: { max: 65535, actual: 70000 } });
            expect(check(1.5)).toEqual({ integer: true });
        });
    });
});
