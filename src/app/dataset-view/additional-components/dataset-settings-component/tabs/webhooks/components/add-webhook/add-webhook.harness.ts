/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { WebhookFormHarness } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.harness";

export class AddWebhookHarness extends ComponentHarness {
    public static readonly hostSelector = "app-add-webhook";

    private static readonly SUBMIT_BUTTON_TEST_ID = "add-subscription-button";

    public readonly getForm = this.locatorFor(WebhookFormHarness);

    private readonly locatorSubmitButton = this.locatorFor(
        `[data-test-id="${AddWebhookHarness.SUBMIT_BUTTON_TEST_ID}"]`,
    );

    public async isSubmitDisabled(): Promise<boolean> {
        const button = await this.locatorSubmitButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async submit(): Promise<void> {
        const button = await this.locatorSubmitButton();
        await button.click();
    }
}
