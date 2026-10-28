/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";

import { AccountTabs } from "src/app/account/account.constants";
import ProjectLinks from "src/app/project-links";

export const accountActiveTabResolverFn: ResolveFn<AccountTabs> = (route: ActivatedRouteSnapshot) => {
    const activeTab = requireValue(
        enumValueOf(AccountTabs, route.children[0]?.children[0]?.data[ProjectLinks.URL_PARAM_TAB]),
        "Route has no AccountTabs tab",
    );
    return activeTab;
};
