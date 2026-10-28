/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class CacheFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-cache-field";

    private static readonly CHECKBOX_TEST_ID_SUFFIX = "-checkbox";

    public async toggle(): Promise<void> {
        const checkbox = await this.element(CacheFieldHarness.CHECKBOX_TEST_ID_SUFFIX);
        await checkbox.click();
    }

    public async isChecked(): Promise<boolean> {
        const checkbox = await this.element(CacheFieldHarness.CHECKBOX_TEST_ID_SUFFIX);
        return this.isElementChecked(checkbox);
    }
}
