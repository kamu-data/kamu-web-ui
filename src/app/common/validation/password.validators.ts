/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { asciiValidator } from "@common/validation/text.validators";
import { MaybeNull } from "@interface/app.types";

/** The backend rejects a shorter password whatever the configured minimum says. */
export const SERVER_MIN_PASSWORD_LENGTH = 8;

/** Fails with `minlength` when the value, trimmed as the backend trims it, is shorter than `minLength`. */
export function trimmedMinLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || value === "") {
            return null;
        }
        const actualLength = value.trim().length;
        return actualLength < minLength ? { minlength: { requiredLength: minLength, actualLength } } : null;
    };
}

/** A new password that the backend accepts and that meets the configured minimum length. */
export function newPasswordValidators(configuredMinLength: number): ValidatorFn[] {
    return [trimmedMinLengthValidator(Math.max(configuredMinLength, SERVER_MIN_PASSWORD_LENGTH)), asciiValidator()];
}

/**
 * A group validator that marks `matchingControlName` with `passwordsMismatch` while its value differs from
 * `controlName`. It adds and removes only that key, so the control's own errors stay.
 */
export function matchFieldsValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): MaybeNull<ValidationErrors> => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        if (!control || !matchingControl) {
            throw new Error(`[matchFieldsValidator]: One of the controls was not found.`);
        }

        const ownErrors = Object.fromEntries(
            Object.entries(matchingControl.errors ?? {}).filter(([key]) => key !== "passwordsMismatch"),
        );
        const errors = control.value !== matchingControl.value ? { ...ownErrors, passwordsMismatch: true } : ownErrors;
        matchingControl.setErrors(Object.keys(errors).length ? errors : null);

        return null;
    };
}
