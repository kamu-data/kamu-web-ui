/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { AccountTabs } from "src/app/account/account.constants";
import ProjectLinks from "src/app/project-links";

export const accountActiveTabResolver: ResolveFn<AccountTabs> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children[0].children[0].data[ProjectLinks.URL_PARAM_TAB] as AccountTabs;
    return activeTab;
};
