/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

/** Fails with `integer` when a set value is not a whole number. */
export function integerValidator(): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (value === null || value === undefined || value === "") {
            return null;
        }
        return Number.isInteger(Number(value)) ? null : { integer: true };
    };
}

/** A whole number within the bounds, both inclusive. */
export function integerInRangeValidators(min: number, max?: number): ValidatorFn[] {
    const validators = [integerValidator(), Validators.min(min)];
    return max === undefined ? validators : [...validators, Validators.max(max)];
}

export const PORT_MIN = 1;
export const PORT_MAX = 65535;

/** A TCP port number. */
export function portValidators(): ValidatorFn[] {
    return integerInRangeValidators(PORT_MIN, PORT_MAX);
}
