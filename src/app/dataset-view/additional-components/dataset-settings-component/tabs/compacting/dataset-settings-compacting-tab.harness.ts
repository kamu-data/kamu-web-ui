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

import { SliceUnit } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";

export class DatasetSettingsCompactingTabHarness extends ComponentHarness {
    public static readonly hostSelector = "app-dataset-settings-compacting-tab";

    private static readonly SLICE_SIZE_INPUT_TEST_ID = "slice-size";
    private static readonly SLICE_SIZE_ERROR_TEST_ID = "slice-size-error";
    private static readonly SLICE_UNIT_SELECT_TEST_ID = "slice-unit";
    private static readonly RECORDS_COUNT_INPUT_TEST_ID = "records-count";
    private static readonly RECORDS_COUNT_ERROR_TEST_ID = "records-count-error";
    private static readonly RUN_BUTTON_TEST_ID = "run-compaction-btn";

    private readonly locatorSliceSizeInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetSettingsCompactingTabHarness.SLICE_SIZE_INPUT_TEST_ID }),
    );
    private readonly locatorSliceSizeError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: DatasetSettingsCompactingTabHarness.SLICE_SIZE_ERROR_TEST_ID }),
    );
    private readonly locatorSliceUnitSelect = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetSettingsCompactingTabHarness.SLICE_UNIT_SELECT_TEST_ID }),
    );
    private readonly locatorRecordsCountInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: DatasetSettingsCompactingTabHarness.RECORDS_COUNT_INPUT_TEST_ID }),
    );
    private readonly locatorRecordsCountError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: DatasetSettingsCompactingTabHarness.RECORDS_COUNT_ERROR_TEST_ID }),
    );
    private readonly locatorRunButton = this.locatorFor(
        `[data-test-id="${DatasetSettingsCompactingTabHarness.RUN_BUTTON_TEST_ID}"]`,
    );

    public async setSliceSize(value: string): Promise<void> {
        const input = await this.locatorSliceSizeInput();
        await input.setValue(value);
    }

    public async setSliceUnit(unit: SliceUnit): Promise<void> {
        const select = await this.locatorSliceUnitSelect();
        await select.selectValue(unit);
    }

    public async getSliceSizeError(): Promise<MaybeNull<string>> {
        const error = await this.locatorSliceSizeError();
        return error.getMessage();
    }

    public async setRecordsCount(value: string): Promise<void> {
        const input = await this.locatorRecordsCountInput();
        await input.setValue(value);
    }

    public async getRecordsCountError(): Promise<MaybeNull<string>> {
        const error = await this.locatorRecordsCountError();
        return error.getMessage();
    }

    public async isRunCompactionDisabled(): Promise<boolean> {
        const button = await this.locatorRunButton();
        const disabled: unknown = await button.getProperty("disabled");
        return disabled === true;
    }

    public async runCompaction(): Promise<void> {
        const button = await this.locatorRunButton();
        await button.click();
    }
}
