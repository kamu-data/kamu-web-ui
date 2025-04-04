/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { activeTabResolver } from "./active-tab.resolver";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import ProjectLinks from "src/app/project-links";

describe("activeTabResolver", () => {
    const executeResolver: ResolveFn<string> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => activeTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check activeTabResolver", async () => {
        const mockState = {
            url: `/kamu/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}`,
        } as RouterStateSnapshot;
        const mockRoute = {} as ActivatedRouteSnapshot;
        const result = await activeTabResolver(mockRoute, mockState);

        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });

    it("should check activeTabResolver with query params", async () => {
        const mockState = {
            url: `/kamu/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}?page=2`,
        } as RouterStateSnapshot;
        const mockRoute = {} as ActivatedRouteSnapshot;
        const result = await activeTabResolver(mockRoute, mockState);

        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });
});
