/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness, TestKey } from "@angular/cdk/testing";
import { MatChipGridHarness, MatChipInputHarness } from "@angular/material/chips/testing";

export class EditDetailsModalHarness extends ComponentHarness {
    public static readonly hostSelector = "app-details-modal";

    private static readonly KEYWORD_INPUT_TEST_ID = "input-keyword";
    private static readonly SAVE_BUTTON_TEST_ID = "commit-event";

    private readonly locatorKeywordInput = this.locatorFor(
        MatChipInputHarness.with({ selector: `[data-test-id="${EditDetailsModalHarness.KEYWORD_INPUT_TEST_ID}"]` }),
    );
    private readonly locatorKeywordGrid = this.locatorFor(MatChipGridHarness);
    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${EditDetailsModalHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    /** Types a keyword into the chip input and ends it with Enter, as a user adds one. */
    public async addKeyword(keyword: string): Promise<void> {
        const input = await this.locatorKeywordInput();
        await input.setValue(keyword);
        await input.sendSeparatorKey(TestKey.ENTER);
    }

    public async getKeywordInputValue(): Promise<string> {
        const input = await this.locatorKeywordInput();
        return input.getValue();
    }

    public async getKeywords(): Promise<string[]> {
        const grid = await this.locatorKeywordGrid();
        const rows = await grid.getRows();
        const keywords: string[] = [];
        for (const row of rows) {
            const text = await row.getText();
            keywords.push(text.trim());
        }
        return keywords;
    }

    public async removeKeyword(keyword: string): Promise<void> {
        const grid = await this.locatorKeywordGrid();
        const rows = await grid.getRows({ text: keyword });
        const row = rows.at(0);
        if (!row) {
            throw new Error(`There is no keyword "${keyword}"`);
        }
        await row.remove();
    }

    public async isSaveDisabled(): Promise<boolean> {
        const button = await this.locatorSaveButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async save(): Promise<void> {
        const button = await this.locatorSaveButton();
        await button.click();
    }
}
