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

export class SearchSectionHarness extends ComponentHarness {
    public static readonly hostSelector = "app-search-section";

    private static readonly INPUT_DATASET_TEST_ID_PREFIX = "input-dataset-";
    private static readonly INPUT_ALIAS_TEST_ID_PREFIX = "input-alias-";
    private static readonly INPUT_ALIAS_ERROR_TEST_ID_PREFIX = "input-alias-error-";
    private static readonly DELETE_INPUT_TEST_ID_PREFIX = "delete-input-";
    private static readonly ALIASES_ERROR_TEST_ID = "input-aliases-error";

    private readonly locatorInputDatasets = this.locatorForAll(
        `[data-test-id^="${SearchSectionHarness.INPUT_DATASET_TEST_ID_PREFIX}"]`,
    );

    /** The dataset each input reads, as its header shows it (`owner/name`), in the inputs' order */
    public async getInputDatasets(): Promise<string[]> {
        const headers = await this.locatorInputDatasets();
        const texts = await Promise.all(headers.map((header) => header.text()));
        return texts.map((text) => text.replace(/\s*\/\s*/g, "/").replace(/\s+/g, " "));
    }

    public async getAliases(): Promise<string[]> {
        const count = await this.getInputCount();
        const aliases: string[] = [];
        for (let index = 0; index < count; index++) {
            const field = await this.aliasField(index);
            aliases.push(await field.getValue());
        }
        return aliases;
    }

    public async setAlias(index: number, alias: string): Promise<void> {
        const field = await this.aliasField(index);
        await field.setValue(alias);
    }

    public async getAliasError(index: number): Promise<MaybeNull<string>> {
        const error = await this.locatorFor(
            FieldErrorHarness.with({
                dataTestId: `${SearchSectionHarness.INPUT_ALIAS_ERROR_TEST_ID_PREFIX}${index}`,
            }),
        )();
        return error.getMessage();
    }

    public async getAliasesError(): Promise<MaybeNull<string>> {
        const error = await this.locatorFor(
            FieldErrorHarness.with({ dataTestId: SearchSectionHarness.ALIASES_ERROR_TEST_ID }),
        )();
        return error.getMessage();
    }

    public async deleteInput(index: number): Promise<void> {
        const button = await this.locatorFor(
            `[data-test-id="${SearchSectionHarness.DELETE_INPUT_TEST_ID_PREFIX}${index}"]`,
        )();
        await button.click();
    }

    private async getInputCount(): Promise<number> {
        const headers = await this.locatorInputDatasets();
        return headers.length;
    }

    private aliasField(index: number): Promise<NativeInputHarness> {
        return this.locatorFor(
            NativeInputHarness.with({ dataTestId: `${SearchSectionHarness.INPUT_ALIAS_TEST_ID_PREFIX}${index}` }),
        )();
    }
}
