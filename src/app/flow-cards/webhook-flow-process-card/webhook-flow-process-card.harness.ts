/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class WebhookFlowProcessCardHarness extends ComponentHarness {
    public static readonly hostSelector = "app-webhook-flow-process-card";

    private static readonly TOGGLE_STATE_TEST_ID = "webhook-card-toggle-state";

    private readonly locatorToggleStateButton = this.locatorFor(
        `[data-test-id="${WebhookFlowProcessCardHarness.TOGGLE_STATE_TEST_ID}"]`,
    );

    /** "Pause webhook" or "Resume webhook" */
    public async getToggleStateLabel(): Promise<string> {
        const button = await this.locatorToggleStateButton();
        const label = await button.text({ exclude: "mat-icon" });
        return label.replace(/\s+/g, " ").trim();
    }

    public async isToggleStateDisabled(): Promise<boolean> {
        const button = await this.locatorToggleStateButton();
        return button.getProperty<boolean>("disabled");
    }

    public async clickToggleState(): Promise<void> {
        const button = await this.locatorToggleStateButton();
        await button.click();
    }
}
