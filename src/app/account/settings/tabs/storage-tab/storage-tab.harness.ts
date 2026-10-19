/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestElement } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

import { StorageUsageSegment } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

export class StorageTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-storage-tab";

    private static readonly EXPLANATION_TEST_ID = "storage-explanation";
    private static readonly SUMMARY_TEST_ID = "storage-summary";
    private static readonly REMAINING_TEST_ID = "storage-remaining";
    private static readonly UNLIMITED_TEST_ID = "storage-unlimited";
    private static readonly NEAR_QUOTA_TEST_ID = "storage-near-quota";
    private static readonly QUOTA_REACHED_TEST_ID = "storage-quota-reached";
    private static readonly SUPPORT_LINK_TEST_ID = "storage-support-link";
    private static readonly SEGMENT_TEST_ID_PREFIX = "storage-segment-";

    private readonly locatorExplanation = this.locatorFor(`[data-test-id="${StorageTabHarness.EXPLANATION_TEST_ID}"]`);
    private readonly locatorSummary = this.locatorFor(`[data-test-id="${StorageTabHarness.SUMMARY_TEST_ID}"]`);
    private readonly locatorRemaining = this.locatorForOptional(
        `[data-test-id="${StorageTabHarness.REMAINING_TEST_ID}"]`,
    );
    private readonly locatorUnlimited = this.locatorForOptional(
        `[data-test-id="${StorageTabHarness.UNLIMITED_TEST_ID}"]`,
    );
    private readonly locatorNearQuota = this.locatorForOptional(
        `[data-test-id="${StorageTabHarness.NEAR_QUOTA_TEST_ID}"]`,
    );
    private readonly locatorQuotaReached = this.locatorForOptional(
        `[data-test-id="${StorageTabHarness.QUOTA_REACHED_TEST_ID}"]`,
    );
    private readonly locatorSupportLink = this.locatorForOptional(
        `[data-test-id="${StorageTabHarness.SUPPORT_LINK_TEST_ID}"]`,
    );

    public async getExplanation(): Promise<string> {
        return StorageTabHarness.normalizedText(await this.locatorExplanation());
    }

    public async getSummary(): Promise<string> {
        return StorageTabHarness.normalizedText(await this.locatorSummary());
    }

    /** `null` when the quota is unlimited */
    public async getRemaining(): Promise<MaybeNull<string>> {
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
    public async getQuotaExhaustedMessage(): Promise<MaybeNull<string>> {
        const alert = await this.locatorQuotaReached();
        return alert ? StorageTabHarness.normalizedText(alert) : null;
    }

    /** The `mailto:` target of the support link, `null` when no link is shown */
    public async getSupportLink(): Promise<MaybeNull<string>> {
        const link = await this.locatorSupportLink();
        return link ? link.getAttribute("href") : null;
    }

    /** Width of a usage bar segment, in percent of the bar */
    public async getSegmentWidthPercent(segmentId: StorageUsageSegment["id"]): Promise<number> {
        const segment = await this.locatorFor(
            `[data-test-id="${StorageTabHarness.SEGMENT_TEST_ID_PREFIX}${segmentId}"]`,
        )();
        const style = (await segment.getAttribute("style")) ?? "";
        const width = /width:\s*([\d.]+)%/.exec(style);
        if (!width) {
            throw new Error(`Segment ${segmentId} has no width set: "${style}"`);
        }
        return Number(width[1]);
    }

    private static async normalizedText(element: TestElement): Promise<string> {
        const text = await element.text();
        return text.replace(/\s+/g, " ").trim();
    }
}
