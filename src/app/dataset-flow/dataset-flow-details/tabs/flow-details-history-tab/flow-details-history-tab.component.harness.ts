/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

/**
 * Test harness for FlowDetailsHistoryTabComponent that provides a clean API
 * for accessing and testing component elements without direct DOM manipulation.
 */
export class FlowDetailsHistoryTabHarness extends ComponentHarness {
    public static readonly hostSelector = ".container";

    private readonly locatorHistoryItems = this.locatorForAll('ul li[data-test-id^="history-item-"]');
    private readonly locatorAnimationImage = this.locatorForOptional('[data-test-id="animation-image"]');

    /**
     * Gets the total number of history items rendered
     */
    public async getHistoryItemsCount(): Promise<number> {
        const items = await this.locatorHistoryItems();
        return items.length;
    }

    /**
     * Gets a specific history item by index
     */
    private locatorHistoryItem(index: number) {
        return this.locatorForOptional(`[data-test-id="history-item-${index}"]`);
    }

    /**
     * Gets the event description for a specific history item
     */
    public async getHistoryItemDescription(index: number): Promise<string | null> {
        const descriptionElement = await this.locatorForOptional(
            `[data-test-id="history-item-${index}-description"]`,
        )();
        return descriptionElement ? (await descriptionElement.text()).trim() : null;
    }

    /**
     * Gets the event sub-message for a specific history item
     */
    public async getHistoryItemSubMessage(index: number): Promise<string | null> {
        const subMessageElement = await this.locatorForOptional(`[data-test-id="history-item-${index}-submessage"]`)();
        return subMessageElement ? (await subMessageElement.text()).trim() : null;
    }

    /**
     * Gets the event time for a specific history item
     */
    public async getHistoryItemTime(index: number): Promise<string | null> {
        const timeElement = await this.locatorForOptional(`[data-test-id="history-item-${index}-time"]`)();
        return timeElement ? (await timeElement.text()).trim() : null;
    }

    /**
     * Gets the duration for a specific history item
     */
    public async getHistoryItemDuration(index: number): Promise<string | null> {
        const durationElement = await this.locatorForOptional(`[data-test-id="history-item-${index}-duration"]`)();
        return durationElement ? (await durationElement.text()).trim() : null;
    }

    /**
     * Checks if a duration element exists for a specific history item
     */
    public async hasHistoryItemDuration(index: number): Promise<boolean> {
        const durationElement = await this.locatorForOptional(`[data-test-id="history-item-${index}-duration"]`)();
        return durationElement !== null;
    }

    /**
     * Gets the icon information for a specific history item
     */
    public async getHistoryItemIcon(index: number): Promise<{ icon: string; cssClasses: string[] } | null> {
        const iconElement = await this.locatorForOptional(`[data-test-id="history-item-${index}-icon"]`)();
        if (!iconElement) return null;

        const icon = (await iconElement.text()).trim();
        const cssClasses = await iconElement.getAttribute("class");

        return {
            icon,
            cssClasses: cssClasses ? cssClasses.split(" ").filter((cls: string) => cls.length > 0) : [],
        };
    }

    /**
     * Checks if the animation image is displayed (for running flows on the last item)
     */
    public async hasAnimationImage(): Promise<boolean> {
        const element = await this.locatorAnimationImage();
        return element !== null;
    }

    /**
     * Gets the animation image source if it exists
     */
    public async getAnimationImageSrc(): Promise<string | null> {
        const element = await this.locatorAnimationImage();
        return element ? await element.getAttribute("src") : null;
    }

    /**
     * Checks if a specific history item exists
     */
    public async hasHistoryItem(index: number): Promise<boolean> {
        const item = await this.locatorHistoryItem(index)();
        return item !== null;
    }

    /**
     * Gets all history item data for easier testing
     */
    public async getAllHistoryItems(): Promise<
        Array<{
            index: number;
            description: string | null;
            subMessage: string | null;
            time: string | null;
            duration: string | null;
            icon: { icon: string; cssClasses: string[] } | null;
        }>
    > {
        const count = await this.getHistoryItemsCount();
        const items = [];

        for (let i = 0; i < count; i++) {
            items.push({
                index: i,
                description: await this.getHistoryItemDescription(i),
                subMessage: await this.getHistoryItemSubMessage(i),
                time: await this.getHistoryItemTime(i),
                duration: await this.getHistoryItemDuration(i),
                icon: await this.getHistoryItemIcon(i),
            });
        }

        return items;
    }
}
