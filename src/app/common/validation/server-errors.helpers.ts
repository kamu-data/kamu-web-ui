/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl } from "@angular/forms";

/**
 * Shows an error the server returned for this field under it, as the `server` error.
 * The control's next value change runs its validators again, which clears it.
 */
export function setServerError(control: AbstractControl, message: string): void {
    control.setErrors({ ...control.errors, server: { message } });
    control.markAsTouched();
}
