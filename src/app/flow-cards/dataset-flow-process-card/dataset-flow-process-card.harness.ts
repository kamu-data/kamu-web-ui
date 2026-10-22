/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export class DatasetFlowProcessCardHarness extends ComponentHarness {
    public static readonly hostSelector = "app-dataset-flow-process-card";

    private static readonly STATE_TEST_ID = "dataset-card-state";
    private static readonly UPDATE_NOW_TEST_ID = "dataset-card-update-now";
    private static readonly TOGGLE_STATE_TEST_ID = "dataset-card-toggle-state";

    private readonly locatorState = this.locatorFor(`[data-test-id="${DatasetFlowProcessCardHarness.STATE_TEST_ID}"]`);
    private readonly locatorUpdateNowButton = this.locatorFor(
        `[data-test-id="${DatasetFlowProcessCardHarness.UPDATE_NOW_TEST_ID}"]`,
    );
    private readonly locatorToggleStateButton = this.locatorFor(
        `[data-test-id="${DatasetFlowProcessCardHarness.TOGGLE_STATE_TEST_ID}"]`,
    );

    public async getStateText(): Promise<string> {
        const state = await this.locatorState();
        const text = await state.text();
        return text.trim();
    }

    public async clickUpdateNow(): Promise<void> {
        const button = await this.locatorUpdateNowButton();
        await button.click();
    }

    /** "Pause updates" or "Resume updates" */
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
