/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";
import { MatButtonToggleHarness } from "@angular/material/button-toggle/testing";

import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

export class LoadMoreHarness extends ComponentHarness {
    public static readonly hostSelector = "app-load-more";

    private static readonly LOAD_MORE_BUTTON_TEST_ID = "btn-load-more";
    private static readonly ROW_LIMIT_OPTION_TEST_ID_PREFIX = "row-limit-";
    private static readonly ROW_LIMIT_INPUT_TEST_ID = "row-limit-input";
    private static readonly ROW_LIMIT_ERROR_TEST_ID = "row-limit-error";
    private static readonly OPTIONS_BUTTON_TEST_ID = "btn-row-options";
    private static readonly OPTIONS_TEST_ID = "row-options";
    private static readonly HIDDEN_CLASS = "hidden";

    private readonly locatorLoadMoreButton = this.locatorFor(
        `[data-test-id="${LoadMoreHarness.LOAD_MORE_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorOptionsButton = this.locatorFor(
        `[data-test-id="${LoadMoreHarness.OPTIONS_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorOptions = this.locatorFor(`[data-test-id="${LoadMoreHarness.OPTIONS_TEST_ID}"]`);
    private readonly locatorRowLimitInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: LoadMoreHarness.ROW_LIMIT_INPUT_TEST_ID }),
    );
    private readonly locatorRowLimitError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: LoadMoreHarness.ROW_LIMIT_ERROR_TEST_ID }),
    );

    public async toggleOptions(): Promise<void> {
        const button = await this.locatorOptionsButton();
        await button.click();
    }

    public async areOptionsShown(): Promise<boolean> {
        const options = await this.locatorOptions();
        const hidden = await options.hasClass(LoadMoreHarness.HIDDEN_CLASS);
        return !hidden;
    }

    public async selectRowLimitOption(rows: number): Promise<void> {
        const toggle = await this.locatorFor(
            MatButtonToggleHarness.with({
                selector: `[data-test-id="${LoadMoreHarness.ROW_LIMIT_OPTION_TEST_ID_PREFIX}${rows}"]`,
            }),
        )();
        await toggle.check();
    }

    /** Types a number of rows as a user would; an empty string leaves the field blank. */
    public async setRowLimit(rows: string): Promise<void> {
        const input = await this.locatorRowLimitInput();
        await input.setValue(rows);
    }

    public async getRowLimit(): Promise<string> {
        const input = await this.locatorRowLimitInput();
        return input.getValue();
    }

    public async getRowLimitError(): Promise<MaybeNull<string>> {
        const error = await this.locatorRowLimitError();
        return error.getMessage();
    }

    public async isLoadMoreDisabled(): Promise<boolean> {
        const button = await this.locatorLoadMoreButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async loadMore(): Promise<void> {
        const button = await this.locatorLoadMoreButton();
        await button.click();
    }
}
