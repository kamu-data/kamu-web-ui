/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { AccountSettingsLinkPipe } from "@common/pipes/account-settings-link.pipe";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";

describe("AccountSettingsLinkPipe", () => {
    let pipe: AccountSettingsLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new AccountSettingsLinkPipe());
    });

    it("should link to a tab of the user's settings", () => {
        expect(router.serializeUrl(pipe.transform(AccountSettingsTabs.ACCESS_TOKENS))).toEqual(
            "/v/settings/access-tokens",
        );
    });
});
