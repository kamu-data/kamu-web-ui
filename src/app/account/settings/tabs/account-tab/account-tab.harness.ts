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

export class AccountTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-account-tab";

    private static readonly USERNAME_INPUT_TEST_ID = "username";
    private static readonly USERNAME_ERROR_TEST_ID = "username-error";
    private static readonly CHANGE_USERNAME_BUTTON_TEST_ID = "change-username-button";
    private static readonly DELETE_ACCOUNT_BUTTON_TEST_ID = "delete-account-button";

    private readonly locatorUsernameInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: AccountTabHarness.USERNAME_INPUT_TEST_ID }),
    );
    private readonly locatorUsernameError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: AccountTabHarness.USERNAME_ERROR_TEST_ID }),
    );
    private readonly locatorChangeUsernameButton = this.locatorFor(
        `[data-test-id="${AccountTabHarness.CHANGE_USERNAME_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorDeleteAccountButton = this.locatorFor(
        `[data-test-id="${AccountTabHarness.DELETE_ACCOUNT_BUTTON_TEST_ID}"]`,
    );

    /** The form an admin changes another account's password with, or `null` when it is not shown. */
    public readonly getAdminChangePassword = this.locatorForOptional(AdminChangePasswordHarness);

    public async getUsername(): Promise<string> {
        const input = await this.locatorUsernameInput();
        return input.getValue();
    }

    public async setUsername(username: string): Promise<void> {
        const input = await this.locatorUsernameInput();
        await input.setValue(username);
    }

    public async getUsernameError(): Promise<MaybeNull<string>> {
        const error = await this.locatorUsernameError();
        return error.getMessage();
    }

    public async isChangeUsernameDisabled(): Promise<boolean> {
        const button = await this.locatorChangeUsernameButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async changeUsername(): Promise<void> {
        const button = await this.locatorChangeUsernameButton();
        await button.click();
    }

    public async deleteAccount(): Promise<void> {
        const button = await this.locatorDeleteAccountButton();
        await button.click();
    }
}
