/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseListFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export interface KeyValueItem {
    name: string;
    value: string;
}

export class KeyValueFieldHarness extends BaseListFieldHarness {
    public static readonly hostSelector = "app-key-value-field";

    private static readonly NAME_TEST_ID_PREFIX = "-name-";
    private static readonly VALUE_TEST_ID_PREFIX = "-value-";

    protected readonly itemTestIdPrefix = KeyValueFieldHarness.NAME_TEST_ID_PREFIX;

    public async setItem(index: number, item: KeyValueItem): Promise<void> {
        const name = await this.input(`${KeyValueFieldHarness.NAME_TEST_ID_PREFIX}${index}`);
        await name.setValue(item.name);
        const value = await this.input(`${KeyValueFieldHarness.VALUE_TEST_ID_PREFIX}${index}`);
        await value.setValue(item.value);
    }

    public async getItems(): Promise<KeyValueItem[]> {
        const count = await this.itemCount();
        const items: KeyValueItem[] = [];
        for (let index = 0; index < count; index++) {
            const name = await this.input(`${KeyValueFieldHarness.NAME_TEST_ID_PREFIX}${index}`);
            const value = await this.input(`${KeyValueFieldHarness.VALUE_TEST_ID_PREFIX}${index}`);
            items.push({ name: await name.getValue(), value: await value.getValue() });
        }
        return items;
    }
}
