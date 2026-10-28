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

import { AdminChangePasswordHarness } from "src/app/account/settings/tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.harness";

export class PasswordAndAuthenticationTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-password-and-authentication-tab";

    private static readonly CHANGE_PASSWORD_BUTTON_TEST_ID = "change-password-button";
    private static readonly OLD_PASSWORD_INPUT_TEST_ID = "old-password";
    private static readonly OLD_PASSWORD_ERROR_TEST_ID = "old-password-error";
    private static readonly NEW_PASSWORD_INPUT_TEST_ID = "new-password";
    private static readonly NEW_PASSWORD_ERROR_TEST_ID = "new-password-error";
    private static readonly CONFIRM_PASSWORD_INPUT_TEST_ID = "confirm-password";
    private static readonly CONFIRM_PASSWORD_ERROR_TEST_ID = "confirm-password-error";
    private static readonly UPDATE_BUTTON_TEST_ID = "update-password-button";

    private readonly locatorChangePasswordButton = this.locatorFor(
        `[data-test-id="${PasswordAndAuthenticationTabHarness.CHANGE_PASSWORD_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorOldPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.OLD_PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorOldPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.OLD_PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorNewPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.NEW_PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorNewPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.NEW_PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorConfirmPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.CONFIRM_PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorConfirmPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: PasswordAndAuthenticationTabHarness.CONFIRM_PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorUpdateButton = this.locatorFor(
        `[data-test-id="${PasswordAndAuthenticationTabHarness.UPDATE_BUTTON_TEST_ID}"]`,
    );

    /** The change password form an admin sees, or `null` for a user changing their own password. */
    public readonly getAdminChangePassword = this.locatorForOptional(AdminChangePasswordHarness);

    /** Shows or hides the change password form. */
    public async toggleChangePassword(): Promise<void> {
        const button = await this.locatorChangePasswordButton();
        await button.click();
    }

    public async setOldPassword(password: string): Promise<void> {
        const input = await this.locatorOldPasswordInput();
        await input.setValue(password);
    }

    public async getOldPasswordError(): Promise<MaybeNull<string>> {
        const error = await this.locatorOldPasswordError();
        return error.getMessage();
    }

    public async setNewPassword(password: string): Promise<void> {
        const input = await this.locatorNewPasswordInput();
        await input.setValue(password);
    }

    public async getNewPasswordError(): Promise<MaybeNull<string>> {
        const error = await this.locatorNewPasswordError();
        return error.getMessage();
    }

    public async setConfirmPassword(password: string): Promise<void> {
        const input = await this.locatorConfirmPasswordInput();
        await input.setValue(password);
    }

    public async getConfirmPasswordError(): Promise<MaybeNull<string>> {
        const error = await this.locatorConfirmPasswordError();
        return error.getMessage();
    }

    public async isUpdateDisabled(): Promise<boolean> {
        const button = await this.locatorUpdateButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async update(): Promise<void> {
        const button = await this.locatorUpdateButton();
        await button.click();
    }
}
