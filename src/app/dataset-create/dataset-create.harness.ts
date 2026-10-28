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

export class DatasetCreateHarness extends ComponentHarness {
    public static readonly hostSelector = "app-dataset-create";

    private static readonly DATASET_NAME_INPUT_TEST_ID = "dataset-name";
    private static readonly DATASET_NAME_ERROR_TEST_ID = "dataset-name-error";
    private static readonly CREATE_BUTTON_TEST_ID = "create-dataset";
    private static readonly CREATE_ERROR_TEST_ID = "create-error-message";
    private static readonly YAML_SNAPSHOT_CHECKBOX_TEST_ID = "show-monaco-editor";

    private readonly locatorDatasetNameInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetCreateHarness.DATASET_NAME_INPUT_TEST_ID }),
    );
    private readonly locatorDatasetNameError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: DatasetCreateHarness.DATASET_NAME_ERROR_TEST_ID }),
    );
    private readonly locatorCreateButton = this.locatorFor(
        `[data-test-id="${DatasetCreateHarness.CREATE_BUTTON_TEST_ID}"]`,
    );
    private readonly locatorCreateError = this.locatorForOptional(
        `[data-test-id="${DatasetCreateHarness.CREATE_ERROR_TEST_ID}"]`,
    );
    private readonly locatorYamlSnapshotCheckbox = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetCreateHarness.YAML_SNAPSHOT_CHECKBOX_TEST_ID }),
    );

    public async setDatasetName(name: string): Promise<void> {
        const input = await this.locatorDatasetNameInput();
        await input.setValue(name);
    }

    public async getDatasetNameError(): Promise<MaybeNull<string>> {
        const error = await this.locatorDatasetNameError();
        return error.getMessage();
    }

    public async isCreateDisabled(): Promise<boolean> {
        const button = await this.locatorCreateButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async create(): Promise<void> {
        const button = await this.locatorCreateButton();
        await button.click();
    }

    /** Why the backend rejected the snapshot, shown above the form, or `null` when none is shown. */
    public async getCreateError(): Promise<MaybeNull<string>> {
        const error = await this.locatorCreateError();
        return error ? error.text() : null;
    }

    /** Ticks or unticks "Initialize from YAML snapshot". */
    public async toggleYamlSnapshot(): Promise<void> {
        const checkbox = await this.locatorYamlSnapshotCheckbox();
        const host = await checkbox.host();
        await host.click();
    }

    public async isYamlSnapshotChecked(): Promise<boolean> {
        const checkbox = await this.locatorYamlSnapshotCheckbox();
        const host = await checkbox.host();
        const checked: unknown = await host.getProperty("checked");
        return checked === true;
    }

    public async isYamlSnapshotDisabled(): Promise<boolean> {
        const checkbox = await this.locatorYamlSnapshotCheckbox();
        return checkbox.isDisabled();
    }
}
