/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";

function isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === "";
}

/**
 * Fails with `format` while both this control and its sibling `siblingName` are empty, for a pair of fields where
 * either one is enough. The sibling's changes do not run this validator; the form revalidates it.
 */
export function requiredUnlessValidator(siblingName: string, siblingLabel: string): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        const sibling = control.parent?.get(siblingName);
        if (!sibling || !isEmpty(control.value) || !isEmpty(sibling.value)) {
            return null;
        }
        return { format: { message: `is required unless ${siblingLabel} is set` } };
    };
}
