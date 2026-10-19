/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatMenuHarness } from "@angular/material/menu/testing";

import { MaybeNull } from "@interface/app.types";

import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

export class SearchAdditionalButtonsNavHarness extends ComponentHarness {
    public static readonly hostSelector = "app-search-additional-buttons-nav";

    private static readonly MENU_TRIGGER_TEST_ID_PREFIX = "additional-options-trigger-";
    private static readonly MENU_FOOTNOTE_TEST_ID = "additional-options-footnote";

    // The menu panel renders in the CDK overlay, outside the host element
    private readonly locatorMenuFootnote = this.documentRootLocatorFactory().locatorForOptional(
        `[data-test-id="${SearchAdditionalButtonsNavHarness.MENU_FOOTNOTE_TEST_ID}"]`,
    );

    public async openMenu(button: SearchAdditionalButtonsEnum): Promise<void> {
        const menu = await this.menu(button);
        await menu.open();
    }

    public async closeMenu(button: SearchAdditionalButtonsEnum): Promise<void> {
        const menu = await this.menu(button);
        await menu.close();
    }

    /** `null` when the opened menu has no footnote */
    public async getMenuFootnote(): Promise<MaybeNull<string>> {
        const footnote = await this.locatorMenuFootnote();
        if (!footnote) {
            return null;
        }
        const text = await footnote.text();
        return text.trim();
    }

    private menu(button: SearchAdditionalButtonsEnum): Promise<MatMenuHarness> {
        return this.locatorFor(
            MatMenuHarness.with({
                selector: `[data-test-id="${SearchAdditionalButtonsNavHarness.MENU_TRIGGER_TEST_ID_PREFIX}${button}"]`,
            }),
        )();
    }
}
