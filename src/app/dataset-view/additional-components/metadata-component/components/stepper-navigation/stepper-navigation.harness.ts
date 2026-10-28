/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestElement } from "@angular/cdk/testing";

export class StepperNavigationHarness extends ComponentHarness {
    public static readonly hostSelector = "app-stepper-navigation";

    private static readonly NEXT_BUTTON_TEST_ID = "next-button";
    private static readonly SAVE_BUTTON_TEST_ID = "save-button";

    private readonly locatorNextButton = this.locatorFor(
        `[data-test-id="${StepperNavigationHarness.NEXT_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${StepperNavigationHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    public async isNextDisabled(): Promise<boolean> {
        const button = await this.locatorNextButton();
        return this.isDisabled(button);
    }

    public async isSaveDisabled(): Promise<boolean> {
        const button = await this.locatorSaveButton();
        return this.isDisabled(button);
    }

    public async save(): Promise<void> {
        const button = await this.locatorSaveButton();
        await button.click();
    }

    private async isDisabled(button: TestElement): Promise<boolean> {
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }
}
