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
        if (!title) {
            return null;
        }
        const text = await title.text();
        return text.trim();
    }

    /**
     * Gets all rendered downstream flow rows
     */
    public async getRows(): Promise<DownstreamFlowRow[]> {
        const rowElements = await this.locatorRows();
        const count = rowElements.length;
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
            const iconText = await icon.text();
            const iconClasses = await icon.getAttribute("class");
            const flowText = flowElement ? await flowElement.text() : "";
            const flowHref = flowLink ? await flowLink.getAttribute("href") : null;
            const statusText = status ? await status.text() : null;
            const datasetText = dataset ? await dataset.text() : null;
            const datasetHref = dataset ? await dataset.getAttribute("href") : null;
            const unavailableText = unavailable ? await unavailable.text() : null;
            rows.push({
                icon: iconText.trim(),
                iconClasses: (iconClasses ?? "").split(" ").filter((cls) => cls.length > 0),
                flowLabel: flowText.trim(),
                flowHref,
                status: statusText?.trim() ?? null,
                datasetLabel: datasetText?.trim() ?? null,
                datasetHref,
                unavailableDataset: unavailableText?.trim() ?? null,
            });
        }
        return rows;
    }
}
