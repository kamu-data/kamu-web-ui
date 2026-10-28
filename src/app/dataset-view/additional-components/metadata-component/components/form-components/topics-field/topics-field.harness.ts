/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export interface TopicItem {
    path: string;
    /** The quality of service option's value; empty when none is selected. */
    qos: string;
}

export class TopicsFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-topics-field";

    private static readonly PATH_TEST_ID_PREFIX = "-path-";
    private static readonly QOS_TEST_ID_PREFIX = "-qos-";
    private static readonly REMOVE_TEST_ID_PREFIX = "-remove-";
    private static readonly ADD_TEST_ID_SUFFIX = "-add";

    public async isRequiredMarked(): Promise<boolean> {
        return this.hasRequiredMarker();
    }

    public async addItem(): Promise<void> {
        const button = await this.element(TopicsFieldHarness.ADD_TEST_ID_SUFFIX);
        await button.click();
    }

    public async setItem(index: number, item: TopicItem): Promise<void> {
        const path = await this.input(`${TopicsFieldHarness.PATH_TEST_ID_PREFIX}${index}`);
        await path.setValue(item.path);
        const qos = await this.input(`${TopicsFieldHarness.QOS_TEST_ID_PREFIX}${index}`);
        await qos.selectValue(item.qos);
    }

    public async removeItem(index: number): Promise<void> {
        const button = await this.element(`${TopicsFieldHarness.REMOVE_TEST_ID_PREFIX}${index}`);
        await button.click();
    }

    public async getItems(): Promise<TopicItem[]> {
        const paths = await this.elements(TopicsFieldHarness.PATH_TEST_ID_PREFIX);
        const items: TopicItem[] = [];
        for (let index = 0; index < paths.length; index++) {
            const path = await this.input(`${TopicsFieldHarness.PATH_TEST_ID_PREFIX}${index}`);
            const qos = await this.input(`${TopicsFieldHarness.QOS_TEST_ID_PREFIX}${index}`);
            items.push({ path: await path.getValue(), qos: await qos.getValue() });
        }
        return items;
    }
}
