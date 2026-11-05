/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class PageLoadFailedHarness extends ComponentHarness {
    public static readonly hostSelector = "app-page-load-failed";

    private static readonly TITLE_TEST_ID = "error-page-title";
    private static readonly DESCRIPTION_TEST_ID = "page-load-failed-description";
    private static readonly TRY_AGAIN_BUTTON_TEST_ID = "page-load-failed-try-again-button";

    private readonly locatorTitle = this.locatorFor(`[data-test-id="${PageLoadFailedHarness.TITLE_TEST_ID}"]`);
    private readonly locatorDescription = this.locatorFor(
        `[data-test-id="${PageLoadFailedHarness.DESCRIPTION_TEST_ID}"]`,
    );
    private readonly locatorTryAgainButton = this.locatorFor(
        `[data-test-id="${PageLoadFailedHarness.TRY_AGAIN_BUTTON_TEST_ID}"]`,
    );

    public async getTitle(): Promise<string> {
        const title = await this.locatorTitle();
        return title.text();
    }

    public async getDescription(): Promise<string> {
        const description = await this.locatorDescription();
        return description.text();
    }

    public async clickTryAgain(): Promise<void> {
        const button = await this.locatorTryAgainButton();
        await button.click();
    }
}
