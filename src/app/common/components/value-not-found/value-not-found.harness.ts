/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class ValueNotFoundHarness extends ComponentHarness {
    public static readonly hostSelector = "app-value-not-found";

    private static readonly MESSAGE_TEST_ID = "value-not-found-message";
    private static readonly ACTION_TEST_ID = "value-not-found-action";

    private readonly locatorMessage = this.locatorFor(`[data-test-id="${ValueNotFoundHarness.MESSAGE_TEST_ID}"]`);
    private readonly locatorAction = this.locatorFor(`[data-test-id="${ValueNotFoundHarness.ACTION_TEST_ID}"]`);

    public async getMessage(): Promise<string> {
        const message = await this.locatorMessage();
        const text = await message.text();
        return text.trim();
    }

    public async getActionLabel(): Promise<string> {
        const action = await this.locatorAction();
        const text = await action.text();
        return text.trim();
    }

    public async runAction(): Promise<void> {
        const action = await this.locatorAction();
        await action.click();
    }
}
