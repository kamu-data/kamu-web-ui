/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseListFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class ArrayKeysFieldHarness extends BaseListFieldHarness {
    public static readonly hostSelector = "app-array-keys-field";

    private static readonly ITEM_TEST_ID_PREFIX = "-item-";

    protected readonly itemTestIdPrefix = ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX;

    public async setItem(index: number, value: string): Promise<void> {
        const item = await this.input(`${ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX}${index}`);
        await item.setValue(value);
    }

    public async getItems(): Promise<string[]> {
        const count = await this.itemCount();
        const items: string[] = [];
        for (let index = 0; index < count; index++) {
            const item = await this.input(`${ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX}${index}`);
            items.push(await item.getValue());
        }
        return items;
    }
}
