/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { NewPasswordFieldsHarness } from "src/app/account/settings/tabs/password-and-authentication-tab/new-password-fields.harness";

export class AdminChangePasswordHarness extends NewPasswordFieldsHarness {
    public static readonly hostSelector = "app-admin-change-password";
}
