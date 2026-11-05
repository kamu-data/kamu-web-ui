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

export class EditKeyValueModalHarness extends ComponentHarness {
    public static readonly hostSelector = "app-edit-key-value-modal";

    private static readonly KEY_INPUT_TEST_ID = "key";
    private static readonly VALUE_INPUT_TEST_ID = "value";
    private static readonly KEY_ERROR_TEST_ID = "error-key";
    private static readonly VALUE_ERROR_TEST_ID = "error-value";
    private static readonly SAVE_BUTTON_TEST_ID = "save-row";
    private static readonly SECRET_CHECKBOX_TEST_ID = "is-secret";
    private static readonly EXISTING_KEYS_LOAD_FAILED_TEST_ID = "existing-keys-load-failed";
    private static readonly RETRY_EXISTING_KEYS_TEST_ID = "retry-existing-keys";
    private static readonly EXPOSED_VALUE_LOAD_FAILED_TEST_ID = "exposed-value-load-failed";
    private static readonly RETRY_EXPOSED_VALUE_TEST_ID = "retry-exposed-value";

    private readonly locatorKeyInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: EditKeyValueModalHarness.KEY_INPUT_TEST_ID }),
    );
    private readonly locatorValueInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: EditKeyValueModalHarness.VALUE_INPUT_TEST_ID }),
    );
    private readonly locatorKeyError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: EditKeyValueModalHarness.KEY_ERROR_TEST_ID }),
    );
    private readonly locatorValueError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: EditKeyValueModalHarness.VALUE_ERROR_TEST_ID }),
    );
    private readonly locatorSecretCheckbox = this.locatorFor(
        `[data-test-id="${EditKeyValueModalHarness.SECRET_CHECKBOX_TEST_ID}"]`,
    );
    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${EditKeyValueModalHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    private readonly locatorExistingKeysLoadFailed = this.locatorForOptional(
        `[data-test-id="${EditKeyValueModalHarness.EXISTING_KEYS_LOAD_FAILED_TEST_ID}"]`,
    );
    private readonly locatorRetryExistingKeys = this.locatorFor(
        `[data-test-id="${EditKeyValueModalHarness.RETRY_EXISTING_KEYS_TEST_ID}"]`,
    );
    private readonly locatorExposedValueLoadFailed = this.locatorForOptional(
        `[data-test-id="${EditKeyValueModalHarness.EXPOSED_VALUE_LOAD_FAILED_TEST_ID}"]`,
    );
    private readonly locatorRetryExposedValue = this.locatorFor(
        `[data-test-id="${EditKeyValueModalHarness.RETRY_EXPOSED_VALUE_TEST_ID}"]`,
    );

    public async setKey(key: string): Promise<void> {
        const input = await this.locatorKeyInput();
        await input.setValue(key);
    }

    public async setValue(value: string): Promise<void> {
        const input = await this.locatorValueInput();
        await input.setValue(value);
    }

    public async getKey(): Promise<string> {
        const input = await this.locatorKeyInput();
        return input.getValue();
    }

    public async getValue(): Promise<string> {
        const input = await this.locatorValueInput();
        return input.getValue();
    }

    public async isValueHidden(): Promise<boolean> {
        const input = await this.locatorValueInput();
        const type = await input.getType();
        return type === "password";
    }

    public async setSecret(secret: boolean): Promise<void> {
        const checkbox = await this.locatorSecretCheckbox();
        const checked: unknown = await checkbox.getProperty("checked");
        if (checked !== secret) {
            await checkbox.click();
        }
    }

    public async isSecretLocked(): Promise<boolean> {
        const checkbox = await this.locatorSecretCheckbox();
        const disabled: unknown = await checkbox.getProperty("disabled");
        return disabled === true;
    }

    public async touchValue(): Promise<void> {
        const input = await this.locatorValueInput();
        await input.touch();
    }

    public async getKeyError(): Promise<MaybeNull<string>> {
        const error = await this.locatorKeyError();
        return error.getMessage();
    }

    public async getValueError(): Promise<MaybeNull<string>> {
        const error = await this.locatorValueError();
        return error.getMessage();
    }

    public async isKeyReadonly(): Promise<boolean> {
        const input = await this.locatorKeyInput();
        const host = await input.host();
        const readonly = await host.getAttribute("readonly");
        return readonly !== null;
    }

    public async isSaveDisabled(): Promise<boolean> {
        const button = await this.locatorSaveButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    /** The message saying the dataset's keys failed to load, or `null` when none is shown. */
    public async getExistingKeysLoadError(): Promise<MaybeNull<string>> {
        const message = await this.locatorExistingKeysLoadFailed();
        return message ? message.text({ exclude: "button" }) : null;
    }

    public async retryExistingKeys(): Promise<void> {
        const button = await this.locatorRetryExistingKeys();
        await button.click();
    }

    /** The message saying the secret's current value failed to load, or `null` when none is shown. */
    public async getExposedValueLoadError(): Promise<MaybeNull<string>> {
        const message = await this.locatorExposedValueLoadFailed();
        return message ? message.text({ exclude: "button" }) : null;
    }

    public async retryExposedValue(): Promise<void> {
        const button = await this.locatorRetryExposedValue();
        await button.click();
    }

    public async save(): Promise<void> {
        const button = await this.locatorSaveButton();
        await button.click();
    }
}
