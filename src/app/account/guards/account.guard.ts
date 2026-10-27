/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";

import { AccountTabs } from "src/app/account/account.constants";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const accountGuard: CanActivateFn = (route, state) => {
    const navigationService = inject(NavigationService);

    const path = state.url.split(/[?#]/)[0];
    const routeSegments = path.split("/").filter(Boolean);
    if (enumValueOf(AccountTabs, routeSegments[routeSegments.length - 1])) {
        return true;
    }
    // The guarded route has an empty path, so it inherits the account name of its parent
    const accountName = requireValue(route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME));
    return navigationService.ownerViewUrlTree(accountName, AccountTabs.DATASETS);
};
