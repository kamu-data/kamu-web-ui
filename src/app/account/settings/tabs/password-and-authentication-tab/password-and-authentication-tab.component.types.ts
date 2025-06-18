/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

export interface ChangeAdminAccountPasswordFormType {
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}

export interface ChangeUserAccountPasswordFormType {
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
}
