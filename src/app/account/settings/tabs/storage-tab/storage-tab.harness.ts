/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestElement } from "@angular/cdk/testing";

import { StorageUsageSegment } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

export class StorageTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-storage-tab";

    private readonly locatorExplanation = this.locatorFor('[data-test-id="storage-explanation"]');
    private readonly locatorSummary = this.locatorFor('[data-test-id="storage-summary"]');
    private readonly locatorRemaining = this.locatorForOptional('[data-test-id="storage-remaining"]');
    private readonly locatorUnlimited = this.locatorForOptional('[data-test-id="storage-unlimited"]');
    private readonly locatorNearQuota = this.locatorForOptional('[data-test-id="storage-near-quota"]');
    private readonly locatorQuotaReached = this.locatorForOptional('[data-test-id="storage-quota-reached"]');
    private readonly locatorSupportLink = this.locatorForOptional('[data-test-id="storage-support-link"]');

    public async getExplanation(): Promise<string> {
        return StorageTabHarness.normalizedText(await this.locatorExplanation());
    }

    public async getSummary(): Promise<string> {
        return StorageTabHarness.normalizedText(await this.locatorSummary());
    }

    /** `null` when the quota is unlimited */
    public async getRemaining(): Promise<string | null> {
        const remaining = await this.locatorRemaining();
        return remaining ? StorageTabHarness.normalizedText(remaining) : null;
    }

    public async isUnlimited(): Promise<boolean> {
        return (await this.locatorUnlimited()) !== null;
    }

    public async hasNearQuotaWarning(): Promise<boolean> {
        return (await this.locatorNearQuota()) !== null;
    }

    public async isQuotaExhausted(): Promise<boolean> {
        return (await this.locatorQuotaReached()) !== null;
    }

    /** `null` when the quota is not exhausted */
    public async getQuotaExhaustedMessage(): Promise<string | null> {
        const alert = await this.locatorQuotaReached();
        return alert ? StorageTabHarness.normalizedText(alert) : null;
    }

    /** The `mailto:` target of the support link, `null` when no link is shown */
    public async getSupportLink(): Promise<string | null> {
        const link = await this.locatorSupportLink();
        return link ? link.getAttribute("href") : null;
    }

    /** Width of a usage bar segment, in percent of the bar */
    public async getSegmentWidthPercent(segmentId: StorageUsageSegment["id"]): Promise<number> {
        const segment = await this.locatorFor(`[data-test-id="storage-segment-${segmentId}"]`)();
        const style = (await segment.getAttribute("style")) ?? "";
        const width = /width:\s*([\d.]+)%/.exec(style);
        if (!width) {
            throw new Error(`Segment ${segmentId} has no width set: "${style}"`);
        }
        return Number(width[1]);
    }

    private static async normalizedText(element: TestElement): Promise<string> {
        return (await element.text()).replace(/\s+/g, " ").trim();
    }
}
