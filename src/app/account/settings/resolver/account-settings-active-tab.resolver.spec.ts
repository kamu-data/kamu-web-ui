/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { accountSettingsActiveTabResolverFn } from "./account-settings-active-tab.resolver";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";

describe("accountSettingsActiveTabResolverFn", () => {
    const executeResolver: ResolveFn<AccountSettingsTabs> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => accountSettingsActiveTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
