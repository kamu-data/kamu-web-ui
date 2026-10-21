/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { requireValue } from "@common/helpers/app.helpers";

import { AccountTabs } from "src/app/account/account.constants";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

/**
 * The settings tab of an account page manages another account, so only an admin viewing someone
 * else's account may open it; everyone else lands on that account's datasets tab.
 */
export const accountSettingsTabGuard: CanActivateFn = (route) => {
    const loggedUserService = inject(LoggedUserService);
    const navigationService = inject(NavigationService);

    const accountName = requireValue(
        route.pathFromRoot.map((r) => r.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME)).find(Boolean) ?? null,
    );
    const loggedUser = loggedUserService.maybeCurrentlyLoggedInUser;
    const isAdminViewingAnotherAccount = Boolean(loggedUser?.isAdmin) && loggedUser?.accountName !== accountName;
    return isAdminViewingAnotherAccount || navigationService.ownerViewUrlTree(accountName, AccountTabs.DATASETS);
};
