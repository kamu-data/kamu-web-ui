/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestElement } from "@angular/cdk/testing";

export class SelectKindFieldHarness extends ComponentHarness {
    public static readonly hostSelector = "app-select-kind-field";

    private static readonly RADIO_TEST_ID_PREFIX = "radio-";
    private static readonly RADIO_TEST_ID_SUFFIX = "-control";

    /** Picks the kind whose option value is `kind`, such as a `FetchKind`. */
    public async selectKind(kind: string): Promise<void> {
        const radio = await this.radio(kind);
        await radio.click();
    }

    public async isKindSelected(kind: string): Promise<boolean> {
        const radio = await this.radio(kind);
        const checked: unknown = await radio.getProperty("checked");
        return checked === true;
    }

    private async radio(kind: string): Promise<TestElement> {
        return this.locatorFor(
            `[data-test-id="${SelectKindFieldHarness.RADIO_TEST_ID_PREFIX}${kind}${SelectKindFieldHarness.RADIO_TEST_ID_SUFFIX}"]`,
        )();
    }
}
