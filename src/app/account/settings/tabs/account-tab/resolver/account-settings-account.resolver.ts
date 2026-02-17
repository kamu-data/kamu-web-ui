/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";

import { accountSettingsEmailResolverFn } from "../../emails-tab/resolver/account-settings-email.resolver";

export const accountSettingsAccountResolverFn: ResolveFn<AccountWithEmailFragment> = (state, route) => {
    return accountSettingsEmailResolverFn(state, route);
};
