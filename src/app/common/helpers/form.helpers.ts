/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

// For a field component bound into a form by control name, as the source event editor's fields are.
// Each returns the control `name` of `parent` and throws when it is missing or of another kind.

export function requireFormGroup(parent: AbstractControl, name: string): FormGroup {
    const control = parent.get(name);
    if (control instanceof FormGroup) {
        return control;
    }
    throw new Error(`Expecting form control "${name}" to be a FormGroup`);
}

export function requireFormArray(parent: AbstractControl, name: string): FormArray {
    const control = parent.get(name);
    if (control instanceof FormArray) {
        return control;
    }
    throw new Error(`Expecting form control "${name}" to be a FormArray`);
}

export function requireFormControl(parent: AbstractControl, name: string): FormControl {
    const control = parent.get(name);
    if (control instanceof FormControl) {
        return control;
    }
    throw new Error(`Expecting form control "${name}" to be a FormControl`);
}
