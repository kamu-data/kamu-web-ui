/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

/**
 * Drives an ng-select widget from a CDK harness context.
 *
 * ng-select is an overlay-based custom dropdown — not a native <select> — so there is no CDK
 * harness for it. This helper encapsulates the only brittle interaction needed: open the panel
 * by clicking the container, then click an option by its data-test-id. All ng-select fragility
 * is isolated here so callers stay stable.
 *
 * @param harness  The harness instance whose documentRootLocatorFactory is used for overlay lookup.
 * @param selectTestId  The data-test-id on the ng-select host element (e.g. `"root:type:city:kind"`).
 * @param optionTestId  The full data-test-id of the option element to click
 *                      (e.g. `"root:type:city:kind-option:Int64"`).
 */
export async function selectNgOption(
    harness: ComponentHarness,
    selectTestId: string,
    optionTestId: string,
): Promise<void> {
    const root = harness.documentRootLocatorFactory();
    const container = await root.locatorFor(`[data-test-id="${selectTestId}"]`)();
    await container.click();
    const option = await root.locatorFor(`[data-test-id="${optionTestId}"]`)();
    await option.click();
}
