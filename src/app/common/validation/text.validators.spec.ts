/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import {
    asciiValidator,
    formatValidator,
    notBlankValidator,
    noWhitespaceValidator,
    singleCharValidator,
} from "@common/validation/text.validators";
import { MaybeNull } from "@interface/app.types";

function check(validator: ValidatorFn, value: unknown): MaybeNull<ValidationErrors> {
    return validator(new FormControl(value));
}

describe("Text validators", () => {
    describe("formatValidator", () => {
        const validator = formatValidator({ regex: /^[a-z]+$/, message: "may only contain a-z" });

        [
            { value: "", expected: null },
            { value: null, expected: null },
            { value: "abc", expected: null },
            { value: "abc1", expected: { format: { message: "may only contain a-z" } } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(check(validator, value)).toEqual(expected);
            });
        });
    });

    describe("notBlankValidator", () => {
        [
            { value: "", expected: null },
            { value: "a", expected: null },
            { value: " a ", expected: null },
            { value: "   ", expected: { blank: true } },
            { value: "\t\n", expected: { blank: true } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(check(notBlankValidator(), value)).toEqual(expected);
            });
        });
    });

    describe("noWhitespaceValidator", () => {
        [
            { value: "", expected: null },
            { value: "KEY", expected: null },
            { value: "A KEY", expected: { whitespace: true } },
            { value: "KEY\t", expected: { whitespace: true } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(check(noWhitespaceValidator(), value)).toEqual(expected);
            });
        });
    });

    describe("singleCharValidator", () => {
        [
            { value: "", expected: null },
            { value: ",", expected: null },
            { value: ",;", expected: { singleChar: true } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(check(singleCharValidator(), value)).toEqual(expected);
            });
        });
    });

    describe("asciiValidator", () => {
        [
            { value: "", expected: null },
            { value: "p@ss w0rd!~", expected: null },
            { value: "pässword", expected: { format: { message: "may only contain ASCII characters" } } },
            { value: "пароль12", expected: { format: { message: "may only contain ASCII characters" } } },
        ].forEach(({ value, expected }) => {
            it(`should check ${JSON.stringify(value)}`, () => {
                expect(check(asciiValidator(), value)).toEqual(expected);
            });
        });
    });
});
