/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";

export const accountSettingsEmailResolverFn: ResolveFn<AccountWithEmailFragment> = () => {
    const accountEmailService = inject(AccountEmailService);
    const loggedUserService = inject(LoggedUserService);
    return accountEmailService.fetchAccountWithEmail(loggedUserService.currentlyLoggedInUser.accountName);
};
