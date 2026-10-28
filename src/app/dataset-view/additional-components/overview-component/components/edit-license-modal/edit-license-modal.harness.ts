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

/** A field of the license form, named after its control. */
export type LicenseField = "name" | "shortName" | "websiteUrl";

export class EditLicenseModalHarness extends ComponentHarness {
    public static readonly hostSelector = "app-edit-license-modal";

    private static readonly INPUT_TEST_ID_PREFIX = "license-";
    private static readonly ERROR_TEST_ID_PREFIX = "error-message-";
    private static readonly SAVE_BUTTON_TEST_ID = "save-license";

    private readonly locatorSaveButton = this.locatorFor(
        `[data-test-id="${EditLicenseModalHarness.SAVE_BUTTON_TEST_ID}"]`,
    );

    public async getValue(field: LicenseField): Promise<string> {
        const input = await this.locatorForInput(field);
        return input.getValue();
    }

    public async setValue(field: LicenseField, value: string): Promise<void> {
        const input = await this.locatorForInput(field);
        await input.setValue(value);
    }

    public async getError(field: LicenseField): Promise<MaybeNull<string>> {
        const error = await this.locatorFor(
            FieldErrorHarness.with({ dataTestId: `${EditLicenseModalHarness.ERROR_TEST_ID_PREFIX}${field}` }),
        )();
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

    private locatorForInput(field: LicenseField): Promise<NativeInputHarness> {
        return this.locatorFor(
            NativeInputHarness.with({ dataTestId: `${EditLicenseModalHarness.INPUT_TEST_ID_PREFIX}${field}` }),
        )();
    }
}
