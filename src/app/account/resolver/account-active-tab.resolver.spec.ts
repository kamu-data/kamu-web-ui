/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { AccountTabs } from "src/app/account/account.constants";
import { accountActiveTabResolverFn } from "src/app/account/resolver/account-active-tab.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountActiveTabResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check resolver", async () => {
        const tabRoute = routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: AccountTabs.DATASETS } });
        const route = routeSnapshot({ children: [routeSnapshot({ children: [tabRoute] })] });
        const result = await runResolver(accountActiveTabResolverFn, route);

        expect(result).toEqual(AccountTabs.DATASETS);
    });
});
