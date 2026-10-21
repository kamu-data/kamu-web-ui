/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

export class LoginUnavailableHarness extends ComponentHarness {
    public static readonly hostSelector = "app-login-unavailable";

    private static readonly TITLE_TEST_ID = "login-unavailable-title";
    private static readonly SUPPORT_LINK_TEST_ID = "login-unavailable-support-link";

    private readonly locatorTitle = this.locatorFor(`[data-test-id="${LoginUnavailableHarness.TITLE_TEST_ID}"]`);
    private readonly locatorSupportLink = this.locatorForOptional(
        `[data-test-id="${LoginUnavailableHarness.SUPPORT_LINK_TEST_ID}"]`,
    );

    public async getTitle(): Promise<string> {
        const title = await this.locatorTitle();
        return title.text();
    }

    /** `null` when no support email is configured */
    public async getSupportLinkHref(): Promise<MaybeNull<string>> {
        const link = await this.locatorSupportLink();
        return link ? link.getAttribute("href") : null;
    }
}
