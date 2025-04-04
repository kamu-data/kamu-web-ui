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
import { activeTabResolver } from "src/app/common/resolvers/active-tab.resolver";

export const accountGuard: CanActivateFn = async (_, state) => {
    const navigationService = inject(NavigationService);
    const result = await activeTabResolver(_, state);
    if (Object.values(AccountTabs).includes(result as AccountTabs)) {
        return true;
    } else {
        navigationService.navigateToOwnerView(state.url, AccountTabs.DATASETS);
        return false;
    }
};
