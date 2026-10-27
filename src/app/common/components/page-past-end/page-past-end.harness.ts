/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class PagePastEndHarness extends ComponentHarness {
    public static readonly hostSelector = "app-page-past-end";

    private static readonly MESSAGE_TEST_ID = "page-past-end-message";
    private static readonly LAST_PAGE_BUTTON_TEST_ID = "page-past-end-last-page-button";

    private readonly locatorMessage = this.locatorFor(`[data-test-id="${PagePastEndHarness.MESSAGE_TEST_ID}"]`);
    private readonly locatorLastPageButton = this.locatorFor(
        `[data-test-id="${PagePastEndHarness.LAST_PAGE_BUTTON_TEST_ID}"]`,
    );

    public async getMessage(): Promise<string> {
        const message = await this.locatorMessage();
        const text = await message.text();
        return text.trim();
    }

    public async goToLastPage(): Promise<void> {
        const button = await this.locatorLastPageButton();
        await button.click();
    }
}
