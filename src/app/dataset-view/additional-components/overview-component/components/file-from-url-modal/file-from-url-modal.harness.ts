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

export class FileFromUrlModalHarness extends ComponentHarness {
    public static readonly hostSelector = "app-file-from-url-modal";

    private static readonly URL_INPUT_TEST_ID = "file-url";
    private static readonly URL_ERROR_TEST_ID = "file-url-error";
    private static readonly SAVE_BUTTON_TEST_ID = "save-file-url";

    private readonly locatorUrlInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: FileFromUrlModalHarness.URL_INPUT_TEST_ID }),
    );
    private readonly locatorUrlError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: FileFromUrlModalHarness.URL_ERROR_TEST_ID }),
    );
    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${FileFromUrlModalHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    public async setUrl(url: string): Promise<void> {
        const input = await this.locatorUrlInput();
        await input.setValue(url);
    }

    public async getUrlError(): Promise<MaybeNull<string>> {
        const error = await this.locatorUrlError();
        return error.getMessage();
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
