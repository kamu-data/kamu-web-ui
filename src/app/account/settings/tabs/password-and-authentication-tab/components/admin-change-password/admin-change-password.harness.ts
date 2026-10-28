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

export class AdminChangePasswordHarness extends ComponentHarness {
    public static readonly hostSelector = "app-admin-change-password";

    private static readonly NEW_PASSWORD_INPUT_TEST_ID = "new-password";
    private static readonly NEW_PASSWORD_ERROR_TEST_ID = "new-password-error";
    private static readonly CONFIRM_PASSWORD_INPUT_TEST_ID = "confirm-password";
    private static readonly CONFIRM_PASSWORD_ERROR_TEST_ID = "confirm-password-error";
    private static readonly UPDATE_BUTTON_TEST_ID = "update-password-button";

    private readonly locatorNewPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: AdminChangePasswordHarness.NEW_PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorNewPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: AdminChangePasswordHarness.NEW_PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorConfirmPasswordInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: AdminChangePasswordHarness.CONFIRM_PASSWORD_INPUT_TEST_ID }),
    );
    private readonly locatorConfirmPasswordError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: AdminChangePasswordHarness.CONFIRM_PASSWORD_ERROR_TEST_ID }),
    );
    private readonly locatorUpdateButton = this.locatorFor(
        `[data-test-id="${AdminChangePasswordHarness.UPDATE_BUTTON_TEST_ID}"]`,
    );

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
