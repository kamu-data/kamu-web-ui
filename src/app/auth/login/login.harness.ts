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

export class LoginHarness extends ComponentHarness {
    public static readonly hostSelector = "app-login";

    private static readonly METHOD_SELECTION_BLOCK_TEST_ID = "method-selection-block";
    private static readonly GITHUB_SPINNER_TEST_ID = "github-spinner";
    private static readonly PASSWORD_METHOD_BLOCK_TEST_ID = "password-method-block";
    private static readonly SELECT_METHOD_GITHUB_TEST_ID = "select-method-github";
    private static readonly SELECT_METHOD_PASSWORD_TEST_ID = "select-method-password";
    private static readonly PASSWORD_LOGIN_FORM_TEST_ID = "password-login-form";
    private static readonly LOGIN_INPUT_TEST_ID = "input-login";
    private static readonly LOGIN_ERROR_TEST_ID = "input-login-error";
    private static readonly PASSWORD_INPUT_TEST_ID = "input-password";
    private static readonly PASSWORD_ERROR_TEST_ID = "input-password-error";
    private static readonly SUBMIT_BUTTON_TEST_ID = "submit-password";
    private static readonly PASSWORD_METHOD_ERROR_TEST_ID = "password-method-error";
    private static readonly INVALID_DEVICE_CODE_TEST_ID = "invalid-device-code";

    private readonly locatorMethodSelectionBlock = this.locatorForOptional(
        `[data-test-id="${LoginHarness.METHOD_SELECTION_BLOCK_TEST_ID}"]`,
    );
    private readonly locatorGithubSpinner = this.locatorForOptional(
        `[data-test-id="${LoginHarness.GITHUB_SPINNER_TEST_ID}"]`,
    );
    private readonly locatorPasswordMethodBlock = this.locatorForOptional(
        `[data-test-id="${LoginHarness.PASSWORD_METHOD_BLOCK_TEST_ID}"]`,
    );
    private readonly locatorSelectGithubButton = this.locatorFor(
        `[data-test-id="${LoginHarness.SELECT_METHOD_GITHUB_TEST_ID}"]`,
    );
    private readonly locatorSelectPasswordButton = this.locatorFor(
        `[data-test-id="${LoginHarness.SELECT_METHOD_PASSWORD_TEST_ID}"]`,
    );
    private readonly locatorPasswordLoginForm = this.locatorFor(
        `[data-test-id="${LoginHarness.PASSWORD_LOGIN_FORM_TEST_ID}"]`,
    );
    private readonly locatorLoginInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: LoginHarness.LOGIN_INPUT_TEST_ID }),
    );
    private readonly locatorLoginError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: LoginHarness.LOGIN_ERROR_TEST_ID }),
    );
    private readonly locatorPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: LoginHarness.PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: LoginHarness.PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorSubmitButton = this.locatorFor(`[data-test-id="${LoginHarness.SUBMIT_BUTTON_TEST_ID}"]`);
    private readonly locatorPasswordMethodError = this.locatorForOptional(
        `[data-test-id="${LoginHarness.PASSWORD_METHOD_ERROR_TEST_ID}"]`,
    );
    private readonly locatorInvalidDeviceCode = this.locatorForOptional(
        `[data-test-id="${LoginHarness.INVALID_DEVICE_CODE_TEST_ID}"]`,
    );

    public async isMethodSelectionShown(): Promise<boolean> {
        const block = await this.locatorMethodSelectionBlock();
        return block !== null;
    }

    public async isGithubSpinnerShown(): Promise<boolean> {
        const spinner = await this.locatorGithubSpinner();
        return spinner !== null;
    }

    public async isPasswordFormShown(): Promise<boolean> {
        const block = await this.locatorPasswordMethodBlock();
        return block !== null;
    }

    public async isInvalidDeviceCodeShown(): Promise<boolean> {
        const alert = await this.locatorInvalidDeviceCode();
        return alert !== null;
    }

    public async selectGithub(): Promise<void> {
        const button = await this.locatorSelectGithubButton();
        await button.click();
    }

    public async selectPassword(): Promise<void> {
        const button = await this.locatorSelectPasswordButton();
        await button.click();
    }

    public async setLogin(login: string): Promise<void> {
        const input = await this.locatorLoginInput();
        await input.setValue(login);
    }

    public async getLoginError(): Promise<MaybeNull<string>> {
        const error = await this.locatorLoginError();
        return error.getMessage();
    }

    public async setPassword(password: string): Promise<void> {
        const input = await this.locatorPasswordInput();
        await input.setValue(password);
    }

    public async getPasswordError(): Promise<MaybeNull<string>> {
        const error = await this.locatorPasswordError();
        return error.getMessage();
    }

    public async isSubmitDisabled(): Promise<boolean> {
        const button = await this.locatorSubmitButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    /** Clicks the login button. */
    public async submit(): Promise<void> {
        const button = await this.locatorSubmitButton();
        await button.click();
    }

    /** Submits the form the way Enter in a field does, without the button. */
    public async submitForm(): Promise<void> {
        const form = await this.locatorPasswordLoginForm();
        await form.dispatchEvent("submit");
    }

    /** The error the server returned for the last login, or `null` when none is shown. */
    public async getLoginFailure(): Promise<MaybeNull<string>> {
        const error = await this.locatorPasswordMethodError();
        return error ? error.text() : null;
    }
}
