/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestElement } from "@angular/cdk/testing";

export class SubscriptionsTableHarness extends ComponentHarness {
    public static readonly hostSelector = "app-subscriptions-table";

    private static readonly TOGGLE_TEST_ID_PREFIX = "subscription-toggle-";

    /** Pauses an active subscription, resumes any other */
    public async clickToggle(subscriptionId: string): Promise<void> {
        const button = await this.toggleButton(subscriptionId);
        await button.click();
    }

    public async isToggleDisabled(subscriptionId: string): Promise<boolean> {
        const button = await this.toggleButton(subscriptionId);
        return button.getProperty<boolean>("disabled");
    }

    private toggleButton(subscriptionId: string): Promise<TestElement> {
        return this.locatorFor(
            `[data-test-id="${SubscriptionsTableHarness.TOGGLE_TEST_ID_PREFIX}${subscriptionId}"]`,
        )();
    }
}
