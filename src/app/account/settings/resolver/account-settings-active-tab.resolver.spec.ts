/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { accountSettingsActiveTabResolverFn } from "src/app/account/settings/resolver/account-settings-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountSettingsActiveTabResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check to resolve an active tab", async () => {
        const tabRoute = routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCESS_TOKENS } });
        const route = routeSnapshot({ children: [tabRoute] });
        const result = await runResolver(accountSettingsActiveTabResolverFn, route);
        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });
});
