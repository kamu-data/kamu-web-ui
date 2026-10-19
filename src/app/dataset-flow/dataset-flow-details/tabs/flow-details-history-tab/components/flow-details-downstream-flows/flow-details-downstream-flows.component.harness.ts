/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

export interface DownstreamFlowRow {
    icon: string;
    iconClasses: string[];
    flowLabel: string;
    flowHref: string | null;
    status: string | null;
    datasetLabel: string | null;
    datasetHref: string | null;
    unavailableDataset: string | null;
}

/**
 * Test harness for FlowDetailsDownstreamFlowsComponent
 */
export class FlowDetailsDownstreamFlowsHarness extends ComponentHarness {
    public static readonly hostSelector = "app-flow-details-downstream-flows";

    private static readonly TITLE_TEST_ID = "downstream-flows-title";
    private static readonly ROW_TEST_ID_PREFIX = "downstream-flow-";

    private readonly locatorTitle = this.locatorForOptional(
        `[data-test-id="${FlowDetailsDownstreamFlowsHarness.TITLE_TEST_ID}"]`,
    );
    private readonly locatorRows = this.locatorForAll(
        `li[data-test-id^="${FlowDetailsDownstreamFlowsHarness.ROW_TEST_ID_PREFIX}"]`,
    );

    /**
     * Gets the list title, or null when nothing is rendered
     */
    public async getTitle(): Promise<string | null> {
        const title = await this.locatorTitle();
        return title ? (await title.text()).trim() : null;
    }

    /**
     * Gets all rendered downstream flow rows
     */
    public async getRows(): Promise<DownstreamFlowRow[]> {
        const count = (await this.locatorRows()).length;
        const rows: DownstreamFlowRow[] = [];
        for (let i = 0; i < count; i++) {
            const prefix = `${FlowDetailsDownstreamFlowsHarness.ROW_TEST_ID_PREFIX}${i}`;
            const icon = await this.locatorFor(`[data-test-id="${prefix}"] mat-icon`)();
            const flowLink = await this.locatorForOptional(`[data-test-id="${prefix}-link"]`)();
            const flowId = await this.locatorForOptional(`[data-test-id="${prefix}-id"]`)();
            const status = await this.locatorForOptional(`[data-test-id="${prefix}-status"]`)();
            const dataset = await this.locatorForOptional(`[data-test-id="${prefix}-dataset"]`)();
            const unavailable = await this.locatorForOptional(`[data-test-id="${prefix}-unavailable-dataset"]`)();
            const flowElement = flowLink ?? flowId;
            rows.push({
                icon: (await icon.text()).trim(),
                iconClasses: ((await icon.getAttribute("class")) ?? "").split(" ").filter((cls) => cls.length > 0),
                flowLabel: flowElement ? (await flowElement.text()).trim() : "",
                flowHref: flowLink ? await flowLink.getAttribute("href") : null,
                status: status ? (await status.text()).trim() : null,
                datasetLabel: dataset ? (await dataset.text()).trim() : null,
                datasetHref: dataset ? await dataset.getAttribute("href") : null,
                unavailableDataset: unavailable ? (await unavailable.text()).trim() : null,
            });
        }
        return rows;
    }
}
