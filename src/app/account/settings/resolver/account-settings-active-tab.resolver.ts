/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import ProjectLinks from "src/app/project-links";

export const accountSettingsActiveTabResolverFn: ResolveFn<AccountSettingsTabs> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children[0]?.data[ProjectLinks.URL_PARAM_TAB] as AccountSettingsTabs;
    return activeTab;
};
