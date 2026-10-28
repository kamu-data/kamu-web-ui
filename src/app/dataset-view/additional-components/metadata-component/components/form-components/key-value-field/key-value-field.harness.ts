/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export interface KeyValueItem {
    name: string;
    value: string;
}

export class KeyValueFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-key-value-field";

    private static readonly NAME_TEST_ID_PREFIX = "-name-";
    private static readonly VALUE_TEST_ID_PREFIX = "-value-";
    private static readonly REMOVE_TEST_ID_PREFIX = "-remove-";
    private static readonly ADD_TEST_ID_SUFFIX = "-add";

    public async getButtonText(): Promise<string> {
        const button = await this.element(KeyValueFieldHarness.ADD_TEST_ID_SUFFIX);
        const text = await button.text();
        return text.trim();
    }

    public async addItem(): Promise<void> {
        const button = await this.element(KeyValueFieldHarness.ADD_TEST_ID_SUFFIX);
        await button.click();
    }

    public async setItem(index: number, item: KeyValueItem): Promise<void> {
        const name = await this.input(`${KeyValueFieldHarness.NAME_TEST_ID_PREFIX}${index}`);
        await name.setValue(item.name);
        const value = await this.input(`${KeyValueFieldHarness.VALUE_TEST_ID_PREFIX}${index}`);
        await value.setValue(item.value);
    }

    public async removeItem(index: number): Promise<void> {
        const button = await this.element(`${KeyValueFieldHarness.REMOVE_TEST_ID_PREFIX}${index}`);
        await button.click();
    }

    public async getItems(): Promise<KeyValueItem[]> {
        const names = await this.elements(KeyValueFieldHarness.NAME_TEST_ID_PREFIX);
        const items: KeyValueItem[] = [];
        for (let index = 0; index < names.length; index++) {
            const name = await this.input(`${KeyValueFieldHarness.NAME_TEST_ID_PREFIX}${index}`);
            const value = await this.input(`${KeyValueFieldHarness.VALUE_TEST_ID_PREFIX}${index}`);
            items.push({ name: await name.getValue(), value: await value.getValue() });
        }
        return items;
    }
}
