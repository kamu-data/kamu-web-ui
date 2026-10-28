/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl } from "@angular/forms";

/**
 * What a service returns for a mutation that kamu-cli can reject because of one field of the form: the result, or
 * the message for that field, which the component shows with `setServerError`.
 */
export type FieldMutationResult<T> = { ok: true; value: T } | { ok: false; fieldError: string };

/**
 * Shows an error the server returned for this field under it, as the `server` error.
 * The control's next value change runs its validators again, which clears it.
 */
export function setServerError(control: AbstractControl, message: string): void {
    control.setErrors({ ...control.errors, server: { message } });
    control.markAsTouched();
}
