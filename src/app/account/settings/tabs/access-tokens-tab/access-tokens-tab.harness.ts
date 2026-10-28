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

export class AccessTokensTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-access-tokens-tab";

    private static readonly NEW_TOKEN_BUTTON_TEST_ID = "new-token-button";
    private static readonly TOKEN_NAME_INPUT_TEST_ID = "token-name";
    private static readonly TOKEN_NAME_ERROR_TEST_ID = "token-name-error";
    private static readonly NEW_TOKEN_FORM_TEST_ID = "new-token-form";
    private static readonly GENERATE_BUTTON_TEST_ID = "generate-new-token";
    private static readonly CANCEL_BUTTON_TEST_ID = "cancel-button";
    private static readonly DONE_BUTTON_TEST_ID = "done-button";

    private readonly locatorNewTokenButton = this.locatorFor(
        `[data-test-id="${AccessTokensTabHarness.NEW_TOKEN_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorTokenNameInput = this.locatorForOptional(
        NativeInputHarness.with({ dataTestId: AccessTokensTabHarness.TOKEN_NAME_INPUT_TEST_ID }),
    );
    private readonly locatorTokenNameError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: AccessTokensTabHarness.TOKEN_NAME_ERROR_TEST_ID }),
    );
    private readonly locatorGenerateButton = this.locatorFor(
        `[data-test-id="${AccessTokensTabHarness.GENERATE_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorCancelButton = this.locatorFor(
        `[data-test-id="${AccessTokensTabHarness.CANCEL_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorDoneButton = this.locatorFor(
        `[data-test-id="${AccessTokensTabHarness.DONE_BUTTON_TEST_ID}"]`,
    );

    /** Opens the form for a new token. */
    public async startNewToken(): Promise<void> {
        const button = await this.locatorNewTokenButton();
        await button.click();
    }

    public async isNewTokenFormShown(): Promise<boolean> {
        const input = await this.locatorTokenNameInput();
        return input !== null;
    }

    public async setTokenName(name: string): Promise<void> {
        const input = await this.locatorTokenNameInput();
        if (!input) {
            throw new Error("The new token form is not shown");
        }
        await input.setValue(name);
    }

    public async getTokenNameError(): Promise<MaybeNull<string>> {
        const error = await this.locatorTokenNameError();
        return error.getMessage();
    }

    public async isGenerateDisabled(): Promise<boolean> {
        const button = await this.locatorGenerateButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async generate(): Promise<void> {
        const button = await this.locatorGenerateButton();
        await button.click();
    }

    /** Submits the name form the way Enter in the name field does, without the Generate button. */
    public async submitNameForm(): Promise<void> {
        const form = await this.locatorFor(`[data-test-id="${AccessTokensTabHarness.NEW_TOKEN_FORM_TEST_ID}"]`)();
        await form.dispatchEvent("submit");
    }

    public async cancel(): Promise<void> {
        const button = await this.locatorCancelButton();
        await button.click();
    }

    public async done(): Promise<void> {
        const button = await this.locatorDoneButton();
        await button.click();
    }
}
