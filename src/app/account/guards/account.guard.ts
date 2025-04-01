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

export const accountGuard: CanActivateFn = (_, state) => {
    const navigationService = inject(NavigationService);
    const routeSegments = state.url.split(/[/?]+/);
    const setSegments = new Set(routeSegments);
    if (Object.values(AccountTabs).filter((item) => setSegments.has(item)).length) {
        return true;
    } else {
        navigationService.navigateToOwnerView(state.url, AccountTabs.DATASETS);
        return false;
    }
};
