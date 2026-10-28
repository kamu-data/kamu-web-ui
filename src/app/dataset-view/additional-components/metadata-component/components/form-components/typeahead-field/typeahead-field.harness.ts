/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseTextFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class TypeaheadFieldHarness extends BaseTextFieldHarness {
    public static readonly hostSelector = "app-typeahead-field";

    // ng-bootstrap renders the suggestion list next to the input; its markup takes no test ids.
    private static readonly SUGGESTION_SELECTOR = "ngb-typeahead-window button";

    private readonly locatorSuggestions = this.locatorForAll(TypeaheadFieldHarness.SUGGESTION_SELECTOR);

    /** Types `text` without leaving the input, so the suggestion list opens. */
    public async typeText(text: string): Promise<void> {
        const input = await this.element("");
        await input.clear();
        await input.sendKeys(text);
    }

    /** The suggestions the open list shows; empty when it is closed. */
    public async getSuggestions(): Promise<string[]> {
        const suggestions = await this.locatorSuggestions();
        const texts: string[] = [];
        for (const suggestion of suggestions) {
            texts.push(await suggestion.text());
        }
        return texts;
    }

    public async selectSuggestion(text: string): Promise<void> {
        const suggestions = await this.locatorSuggestions();
        for (const suggestion of suggestions) {
            const suggestionText = await suggestion.text();
            if (suggestionText === text) {
                await suggestion.click();
                return;
            }
        }
        throw new Error(`No suggestion "${text}"`);
    }
}
