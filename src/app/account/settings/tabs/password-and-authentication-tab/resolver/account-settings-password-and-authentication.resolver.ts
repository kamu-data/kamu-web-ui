/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";

export const accountSettingsPasswordAndAuthenticationResolverFn: ResolveFn<AccountFragment> = () => {
    const loggedUserService = inject(LoggedUserService);
    return loggedUserService.currentlyLoggedInUser;
};
