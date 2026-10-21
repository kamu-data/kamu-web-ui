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

    private static readonly TITLE_TEST_ID = "error-page-title";
    private static readonly DESCRIPTION_TEST_ID = "login-unavailable-description";
    private static readonly SUPPORT_LINK_TEST_ID = "login-unavailable-support-link";
    private static readonly TRY_AGAIN_BUTTON_TEST_ID = "login-unavailable-try-again-button";

    private readonly locatorTitle = this.locatorFor(`[data-test-id="${LoginUnavailableHarness.TITLE_TEST_ID}"]`);
    private readonly locatorDescription = this.locatorFor(
        `[data-test-id="${LoginUnavailableHarness.DESCRIPTION_TEST_ID}"]`,
    );
    private readonly locatorSupportLink = this.locatorForOptional(
        `[data-test-id="${LoginUnavailableHarness.SUPPORT_LINK_TEST_ID}"]`,
    );
    private readonly locatorTryAgainButton = this.locatorForOptional(
        `[data-test-id="${LoginUnavailableHarness.TRY_AGAIN_BUTTON_TEST_ID}"]`,
    );

    public async getTitle(): Promise<string> {
        const title = await this.locatorTitle();
        return title.text();
    }

    /** The explanation as a reader sees it, with whitespace collapsed */
    public async getDescription(): Promise<string> {
        const description = await this.locatorDescription();
        const text = await description.text();
        return text.replace(/\s+/g, " ");
    }

    /** `null` when no support email is configured */
    public async getSupportLinkHref(): Promise<MaybeNull<string>> {
        const link = await this.locatorSupportLink();
        return link ? link.getAttribute("href") : null;
    }

    public async hasTryAgainButton(): Promise<boolean> {
        const button = await this.locatorTryAgainButton();
        return button !== null;
    }

    public async clickTryAgain(): Promise<void> {
        const button = await this.locatorTryAgainButton();
        if (!button) {
            throw new Error("The try again button is not shown");
        }
        await button.click();
    }
}
