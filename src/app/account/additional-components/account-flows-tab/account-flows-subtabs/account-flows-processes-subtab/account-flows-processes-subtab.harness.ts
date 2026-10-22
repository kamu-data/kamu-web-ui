/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatChipListboxHarness } from "@angular/material/chips/testing";

import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";

export class AccountFlowsProcessesSubtabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-account-flows-processes-subtab";

    private static readonly FLOWS_MODE_CHIPS_TEST_ID = "flows-mode-chips";
    private static readonly REFRESH_NOW_TEST_ID = "refresh-now-button";
    private static readonly RESET_FILTERS_TEST_ID = "reset-filters-button";
    private static readonly CARDS_TEST_ID = "cards";
    private static readonly EMPTY_CARDS_TEST_ID = "empty-cards-block";

    private readonly locatorFlowsModeChips = this.locatorFor(
        MatChipListboxHarness.with({
            selector: `[data-test-id="${AccountFlowsProcessesSubtabHarness.FLOWS_MODE_CHIPS_TEST_ID}"]`,
        }),
    );
    private readonly locatorRefreshNowButton = this.locatorFor(
        `[data-test-id="${AccountFlowsProcessesSubtabHarness.REFRESH_NOW_TEST_ID}"]`,
    );
    private readonly locatorResetFiltersButton = this.locatorFor(
        `[data-test-id="${AccountFlowsProcessesSubtabHarness.RESET_FILTERS_TEST_ID}"]`,
    );
    private readonly locatorCards = this.locatorForOptional(
        `[data-test-id="${AccountFlowsProcessesSubtabHarness.CARDS_TEST_ID}"]`,
    );
    private readonly locatorEmptyCards = this.locatorForOptional(
        `[data-test-id="${AccountFlowsProcessesSubtabHarness.EMPTY_CARDS_TEST_ID}"]`,
    );
    private readonly locatorDatasetProcessCards = this.locatorForAll(DatasetFlowProcessCardHarness);

    /** Selects one of the "All flows", "Datasets" and "Webhooks" chips by its text */
    public async selectFlowsMode(chipText: string): Promise<void> {
        const chips = await this.locatorFlowsModeChips();
        await chips.selectChips({ text: chipText });
    }

    public async clickRefreshNow(): Promise<void> {
        const button = await this.locatorRefreshNowButton();
        await button.click();
    }

    /** Available in the custom filters mode only */
    public async clickResetFilters(): Promise<void> {
        const button = await this.locatorResetFiltersButton();
        await button.click();
    }

    public async isCardsBlockVisible(): Promise<boolean> {
        const cards = await this.locatorCards();
        return cards !== null;
    }

    public async isEmptyCardsBlockVisible(): Promise<boolean> {
        const emptyBlock = await this.locatorEmptyCards();
        return emptyBlock !== null;
    }

    public getDatasetProcessCards(): Promise<DatasetFlowProcessCardHarness[]> {
        return this.locatorDatasetProcessCards();
    }
}
