/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { accountActiveTabResolver } from "./account-active-tab.resolver";
import { AccountTabs } from "src/app/account/account.constants";
import ProjectLinks from "src/app/project-links";

describe("accountActiveTabResolver", () => {
    const executeResolver: ResolveFn<AccountTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountActiveTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should be createds", async () => {
        const routeSnapshot = new ActivatedRouteSnapshot();
        const state = {
            url: `/kamu/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}`,
        } as RouterStateSnapshot;
        const result = await executeResolver(routeSnapshot, state);
        expect(result).toEqual(AccountTabs.FLOWS);
    });
});
