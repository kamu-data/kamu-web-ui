/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class FinalYamlModalHarness extends ComponentHarness {
    public static readonly hostSelector = "app-final-yaml-modal";

    private static readonly SAVE_BUTTON_TEST_ID = "save-event";

    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${FinalYamlModalHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    public async isSaveDisabled(): Promise<boolean> {
        const button = await this.locatorSaveButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async save(): Promise<void> {
        const button = await this.locatorSaveButton();
        await button.click();
    }
}
