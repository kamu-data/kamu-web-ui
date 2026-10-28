/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

export interface UniquenessOptions {
    caseInsensitive?: boolean;
}

function normalized(value: string, options: UniquenessOptions): string {
    return options.caseInsensitive ? value.toLowerCase() : value;
}

/**
 * Fails with `duplicate` when the value equals one of the existing values.
 * `existing` is read on every check, so a getter over data that loads later works.
 */
export function uniqueValueValidator(existing: () => readonly string[], options: UniquenessOptions = {}): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const value: unknown = control.value;
        if (typeof value !== "string" || value === "") {
            return null;
        }
        const taken = new Set(existing().map((item) => normalized(item, options)));
        return taken.has(normalized(value, options)) ? { duplicate: true } : null;
    };
}

/**
 * Fails with `duplicateItems` on a `FormArray` whose items, read from each item control by `key`, repeat.
 * The error carries the first repeated value. Empty and non-text values are left to the items' own validators.
 */
export function uniqueItemsValidator(
    key: (itemControl: AbstractControl) => unknown,
    options: UniquenessOptions = {},
): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        if (!(control instanceof FormArray)) {
            return null;
        }
        const seen = new Set<string>();
        for (const itemControl of control.controls) {
            const raw = key(itemControl);
            if (typeof raw !== "string" || raw === "") {
                continue;
            }
            const value = normalized(raw, options);
            if (seen.has(value)) {
                return { duplicateItems: { value: raw } };
            }
            seen.add(value);
        }
        return null;
    };
}
