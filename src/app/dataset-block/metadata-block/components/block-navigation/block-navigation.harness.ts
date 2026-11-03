/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

/** One block's hash in the list. */
class BlockHashHarness extends ComponentHarness {
    public static readonly hostSelector = '[data-test-id="block-hash"]';

    private static readonly MATCH_TEST_ID = "block-hash-match";

    private readonly locatorMatch = this.locatorForOptional(`[data-test-id="${BlockHashHarness.MATCH_TEST_ID}"]`);

    public async getHash(): Promise<string> {
        const host = await this.host();
        const text = await host.text();
        return text.trim();
    }

    public async getHighlightedPart(): Promise<MaybeNull<string>> {
        const match = await this.locatorMatch();
        return match ? match.text() : null;
    }
}

export class BlockNavigationHarness extends ComponentHarness {
    public static readonly hostSelector = "app-block-navigation";

    private static readonly HASH_INPUT_TEST_ID = "searchHash";
    private static readonly HASH_ERROR_TEST_ID = "searchHash-error";
    private static readonly CLEAR_HASH_TEST_ID = "clearSearchHash";
    private static readonly EVENT_TYPES_SELECT_TEST_ID = "eventTypes";
    private static readonly EVENT_TYPE_OPTION_TEST_ID_PREFIX = "event-type-option-";
    private static readonly NO_BLOCK_MATCHES_TEST_ID = "no-block-matches";
    private static readonly BLOCK_LINK_TEST_ID = "block-event-type";

    private readonly locatorHashInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: BlockNavigationHarness.HASH_INPUT_TEST_ID }),
    );
    private readonly locatorHashError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: BlockNavigationHarness.HASH_ERROR_TEST_ID }),
    );
    private readonly locatorClearHash = this.locatorForOptional(
        `[data-test-id="${BlockNavigationHarness.CLEAR_HASH_TEST_ID}"]`,
    );
    private readonly locatorEventTypesContainer = this.locatorFor(
        `[data-test-id="${BlockNavigationHarness.EVENT_TYPES_SELECT_TEST_ID}"] .ng-select-container`,
    );
    private readonly locatorEventTypesInput = this.locatorFor(
        `[data-test-id="${BlockNavigationHarness.EVENT_TYPES_SELECT_TEST_ID}"] input`,
    );
    private readonly locatorEventTypeOptions = this.locatorForAll(
        `[data-test-id^="${BlockNavigationHarness.EVENT_TYPE_OPTION_TEST_ID_PREFIX}"]`,
    );
    private readonly locatorBlockHashes = this.locatorForAll(BlockHashHarness);
    private readonly locatorSelectedEventTypes = this.locatorForAll(
        `[data-test-id="${BlockNavigationHarness.EVENT_TYPES_SELECT_TEST_ID}"] .ng-value-label`,
    );
    private readonly locatorBlockLinks = this.locatorForAll(
        `[data-test-id="${BlockNavigationHarness.BLOCK_LINK_TEST_ID}"]`,
    );
    private readonly locatorPagePastEnd = this.locatorForOptional("app-page-past-end");
    private readonly locatorNoBlockMatches = this.locatorForOptional(
        `[data-test-id="${BlockNavigationHarness.NO_BLOCK_MATCHES_TEST_ID}"]`,
    );

    public async typeHashPrefix(prefix: string): Promise<void> {
        const input = await this.locatorHashInput();
        await input.typeValue(prefix);
    }

    public async getHashPrefix(): Promise<string> {
        const input = await this.locatorHashInput();
        return input.getValue();
    }

    public async getHashError(): Promise<MaybeNull<string>> {
        const error = await this.locatorHashError();
        return error.getMessage();
    }

    public async clearHashPrefix(): Promise<void> {
        const clear = await this.locatorClearHash();
        if (!clear) {
            throw new Error("The hash search has nothing to clear");
        }
        await clear.click();
    }

    /** Picks an event type, by its `MetadataEventType` value, from the dropdown. */
    public async selectEventType(value: string): Promise<void> {
        // ng-select opens its panel on a mousedown on its container, not on its host element
        const container = await this.locatorEventTypesContainer();
        await container.click();
        const option = await this.locatorFor(
            `[data-test-id="${BlockNavigationHarness.EVENT_TYPE_OPTION_TEST_ID_PREFIX}${value}"]`,
        )();
        await option.click();
        const input = await this.locatorEventTypesInput();
        await input.blur();
    }

    /** The labels of the event types the dropdown offers, in its order. */
    public async getEventTypeOptions(): Promise<string[]> {
        const container = await this.locatorEventTypesContainer();
        await container.click();
        const options = await this.locatorEventTypeOptions();
        const labels: string[] = [];
        for (const option of options) {
            const text = await option.text();
            labels.push(text.trim());
        }
        const input = await this.locatorEventTypesInput();
        await input.blur();
        return labels;
    }

    /** The names of the chosen event types. */
    public async getSelectedEventTypes(): Promise<string[]> {
        const labels = await this.locatorSelectedEventTypes();
        const names: string[] = [];
        for (const label of labels) {
            const text = await label.text();
            names.push(text.trim());
        }
        return names;
    }

    /** Where each listed block's link leads. */
    public async getBlockLinks(): Promise<string[]> {
        const links = await this.locatorBlockLinks();
        const hrefs: string[] = [];
        for (const link of links) {
            hrefs.push((await link.getAttribute("href")) ?? "");
        }
        return hrefs;
    }

    public async isPagePastEndShown(): Promise<boolean> {
        const pastEnd = await this.locatorPagePastEnd();
        return pastEnd !== null;
    }

    public async getBlockHashes(): Promise<string[]> {
        const rows = await this.locatorBlockHashes();
        const texts: string[] = [];
        for (const row of rows) {
            texts.push(await row.getHash());
        }
        return texts;
    }

    /** The highlighted part of each listed block hash, `null` for a hash with none. */
    public async getHighlightedHashParts(): Promise<Array<MaybeNull<string>>> {
        const rows = await this.locatorBlockHashes();
        const parts: Array<MaybeNull<string>> = [];
        for (const row of rows) {
            parts.push(await row.getHighlightedPart());
        }
        return parts;
    }

    public async isNoBlockMatchesShown(): Promise<boolean> {
        const message = await this.locatorNoBlockMatches();
        return message !== null;
    }
}
