/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { FormatRule } from "@common/validation/patterns";
import { MaybeNull } from "@interface/app.types";

/** Fails with `format` when a non-empty string does not match the rule. */
export function formatValidator(rule: FormatRule): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || value === "" || rule.regex.test(value)) {
            return null;
        }
        return { format: { message: rule.message } };
    };
}

/** Fails with `blank` when the value is a non-empty string of whitespace only; an empty value is left to `required`. */
export function notBlankValidator(): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        return typeof value === "string" && value !== "" && value.trim() === "" ? { blank: true } : null;
    };
}

/** Fails with `singleChar` when a non-empty value is anything but one ASCII character: kamu-cli counts bytes. */
export function singleCharValidator(): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        return typeof value === "string" && (value.length > 1 || value.charCodeAt(0) >= 128)
            ? { singleChar: true }
            : null;
    };
}

/** Fails with `maxBytes` when the value takes more than `max` bytes in UTF-8, the length kamu-cli checks. */
export function maxBytesValidator(max: number): ValidatorFn {
    const encoder = new TextEncoder();
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string") {
            return null;
        }
        const actual = encoder.encode(value).length;
        return actual > max ? { maxBytes: { max, actual } } : null;
    };
}

/** Fails with `format` when the value has a character outside ASCII. */
export function asciiValidator(): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || [...value].every((char) => char.charCodeAt(0) < 128)) {
            return null;
        }
        return { format: { message: "may only contain ASCII characters" } };
    };
}
