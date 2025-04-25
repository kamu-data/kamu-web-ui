/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../account.constants";

export const accountGuard: CanActivateFn = (route, state) => {
    const navigationService = inject(NavigationService);
    const pathWithoutQuery = state.url.split("?")[0];
    const routeSegments = pathWithoutQuery.split("/").filter(Boolean);
    const result = routeSegments[routeSegments.length - 1] as AccountTabs;
    if (Object.values(AccountTabs).includes(result)) {
        return true;
    } else {
        navigationService.navigateToOwnerView(state.url, AccountTabs.DATASETS);
        return false;
    }
};
