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

export class EmailsTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-emails-tab";

    private static readonly EMAIL_INPUT_TEST_ID = "email-address";
    private static readonly EMAIL_ERROR_TEST_ID = "email-address-error";
    private static readonly CHANGE_EMAIL_BUTTON_TEST_ID = "change-email-button";
    private static readonly SERVER_ERROR_TEST_ID = "change-email-error";

    private readonly locatorEmailInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: EmailsTabHarness.EMAIL_INPUT_TEST_ID }),
    );
    private readonly locatorEmailError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: EmailsTabHarness.EMAIL_ERROR_TEST_ID }),
    );
    private readonly locatorChangeEmailButton = this.locatorFor(
        `[data-test-id="${EmailsTabHarness.CHANGE_EMAIL_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorServerError = this.locatorForOptional(
        `[data-test-id="${EmailsTabHarness.SERVER_ERROR_TEST_ID}"]`,
    );

    public async getEmail(): Promise<string> {
        const input = await this.locatorEmailInput();
        return input.getValue();
    }

    public async setEmail(email: string): Promise<void> {
        const input = await this.locatorEmailInput();
        await input.setValue(email);
    }

    public async getEmailInputType(): Promise<string> {
        const input = await this.locatorEmailInput();
        return input.getType();
    }

    public async getEmailError(): Promise<MaybeNull<string>> {
        const error = await this.locatorEmailError();
        return error.getMessage();
    }

    /** The error the server returned for the last change, or `null` when none is shown. */
    public async getServerError(): Promise<MaybeNull<string>> {
        const error = await this.locatorServerError();
        return error ? error.text() : null;
    }

    public async isChangeEmailDisabled(): Promise<boolean> {
        const button = await this.locatorChangeEmailButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async changeEmail(): Promise<void> {
        const button = await this.locatorChangeEmailButton();
        await button.click();
    }
}
