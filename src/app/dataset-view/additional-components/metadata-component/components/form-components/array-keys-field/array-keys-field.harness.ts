/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class ArrayKeysFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-array-keys-field";

    private static readonly ITEM_TEST_ID_PREFIX = "-item-";
    private static readonly REMOVE_TEST_ID_PREFIX = "-remove-";
    private static readonly ADD_TEST_ID_SUFFIX = "-add";

    public async getButtonText(): Promise<string> {
        const button = await this.element(ArrayKeysFieldHarness.ADD_TEST_ID_SUFFIX);
        const text = await button.text();
        return text.trim();
    }

    public async addItem(): Promise<void> {
        const button = await this.element(ArrayKeysFieldHarness.ADD_TEST_ID_SUFFIX);
        await button.click();
    }

    public async setItem(index: number, value: string): Promise<void> {
        const item = await this.input(`${ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX}${index}`);
        await item.setValue(value);
    }

    public async removeItem(index: number): Promise<void> {
        const button = await this.element(`${ArrayKeysFieldHarness.REMOVE_TEST_ID_PREFIX}${index}`);
        await button.click();
    }

    public async getItems(): Promise<string[]> {
        const elements = await this.elements(ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX);
        const items: string[] = [];
        for (let index = 0; index < elements.length; index++) {
            const item = await this.input(`${ArrayKeysFieldHarness.ITEM_TEST_ID_PREFIX}${index}`);
            items.push(await item.getValue());
        }
        return items;
    }
}
