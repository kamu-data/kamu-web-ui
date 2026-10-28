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

export class DatasetSettingsGeneralTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-dataset-settings-general-tab";

    private static readonly RENAME_INPUT_TEST_ID = "rename-dataset-input";
    private static readonly RENAME_BUTTON_TEST_ID = "rename-dataset-button";
    private static readonly RENAME_ERROR_TEST_ID = "rename-dataset-error";
    private static readonly RENAME_SERVER_ERROR_TEST_ID = "rename-dataset-error-custom";
    private static readonly DELETE_BUTTON_TEST_ID = "delete-dataset-button";
    private static readonly CHANGE_VISIBILITY_BUTTON_TEST_ID = "change-visibility-dataset-button";
    private static readonly RESET_BUTTON_TEST_ID = "reset-dataset-button";

    private static readonly ERROR_BORDER_CLASS = "error-border-color";

    private readonly locatorRenameInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetSettingsGeneralTabHarness.RENAME_INPUT_TEST_ID }),
    );
    private readonly locatorRenameButton = this.locatorFor(
        `[data-test-id="${DatasetSettingsGeneralTabHarness.RENAME_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorRenameError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: DatasetSettingsGeneralTabHarness.RENAME_ERROR_TEST_ID }),
    );
    private readonly locatorRenameServerError = this.locatorForOptional(
        `[data-test-id="${DatasetSettingsGeneralTabHarness.RENAME_SERVER_ERROR_TEST_ID}"]`,
    );
    private readonly locatorDeleteButton = this.locatorForOptional(
        `[data-test-id="${DatasetSettingsGeneralTabHarness.DELETE_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorChangeVisibilityButton = this.locatorFor(
        `[data-test-id="${DatasetSettingsGeneralTabHarness.CHANGE_VISIBILITY_BUTTON_TEST_ID}"]`,
    );

    private readonly locatorResetButton = this.locatorFor(
        `[data-test-id="${DatasetSettingsGeneralTabHarness.RESET_BUTTON_TEST_ID}"]`,
    );

    public async setDatasetName(name: string): Promise<void> {
        const input = await this.locatorRenameInput();
        await input.setValue(name);
    }

    public async getDatasetNameError(): Promise<MaybeNull<string>> {
        const error = await this.locatorRenameError();
        return error.getMessage();
    }

    public async isRenameDisabled(): Promise<boolean> {
        const button = await this.locatorRenameButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async rename(): Promise<void> {
        const button = await this.locatorRenameButton();
        await button.click();
    }

    /** The error the server returned for the last rename, or `null` when none is shown. */
    public async getRenameServerError(): Promise<MaybeNull<string>> {
        const error = await this.locatorRenameServerError();
        return error ? error.text() : null;
    }

    public async isDatasetNameMarkedInvalid(): Promise<boolean> {
        const input = await this.locatorRenameInput();
        const host = await input.host();
        return host.hasClass(DatasetSettingsGeneralTabHarness.ERROR_BORDER_CLASS);
    }

    public async isDeleteShown(): Promise<boolean> {
        const button = await this.locatorDeleteButton();
        return button !== null;
    }

    public async deleteDataset(): Promise<void> {
        const button = await this.locatorDeleteButton();
        if (!button) {
            throw new Error("The delete button is not shown");
        }
        await button.click();
    }

    public async changeVisibility(): Promise<void> {
        const button = await this.locatorChangeVisibilityButton();
        await button.click();
    }

    public async resetDataset(): Promise<void> {
        const button = await this.locatorResetButton();
        await button.click();
    }
}
