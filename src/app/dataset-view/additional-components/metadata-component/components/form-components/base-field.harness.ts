/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import {
    BaseHarnessFilters,
    ComponentHarness,
    ComponentHarnessConstructor,
    HarnessPredicate,
    TestElement,
} from "@angular/cdk/testing";

import { requireValue } from "@common/helpers/app.helpers";
import { NativeInputHarness } from "@common/helpers/native-input.harness";
import { FieldErrorHarness } from "@common/validation/field-error.harness";
import { MaybeNull } from "@interface/app.types";

export interface FieldHarnessFilters extends BaseHarnessFilters {
    /** The `dataTestId` the field was given. */
    dataTestId?: string;
}

/**
 * A field of the source event editor. Its elements carry test ids built from the field's `dataTestId`,
 * which the harness reads from the field's label, the first labelled element inside the field.
 */
export abstract class BaseFieldHarness extends ComponentHarness {
    private static readonly LABEL_TEST_ID_SUFFIX = "-label";
    private static readonly REQUIRED_TEST_ID_SUFFIX = "-required";
    private static readonly ERROR_TEST_ID_SUFFIX = "-error";

    private readonly locatorLabel = this.locatorFor(`[data-test-id$="${BaseFieldHarness.LABEL_TEST_ID_SUFFIX}"]`);

    public static with<H extends BaseFieldHarness>(
        this: ComponentHarnessConstructor<H>,
        options: FieldHarnessFilters = {},
    ): HarnessPredicate<H> {
        return new HarnessPredicate(this, options).addOption(
            "dataTestId",
            options.dataTestId,
            async (harness, dataTestId) => {
                const testId = await harness.getTestId();
                return testId === dataTestId;
            },
        );
    }

    /** The `dataTestId` the field was given. */
    public async getTestId(): Promise<string> {
        const label = await this.locatorLabel();
        const labelTestId = requireValue(await label.getAttribute("data-test-id"));
        return labelTestId.slice(0, -BaseFieldHarness.LABEL_TEST_ID_SUFFIX.length);
    }

    /** The label text, without the required marker. */
    public async getLabel(): Promise<string> {
        const label = await this.locatorLabel();
        const text = await label.text({
            exclude: `[data-test-id$="${BaseFieldHarness.REQUIRED_TEST_ID_SUFFIX}"]`,
        });
        return text.trim();
    }

    protected async hasRequiredMarker(): Promise<boolean> {
        const marker = await this.optionalElement(BaseFieldHarness.REQUIRED_TEST_ID_SUFFIX);
        return marker !== null;
    }

    /** The element whose test id is the field's `dataTestId` followed by `suffix`. */
    protected async element(suffix: string): Promise<TestElement> {
        const testId = await this.getTestId();
        return this.locatorFor(`[data-test-id="${testId}${suffix}"]`)();
    }

    protected async optionalElement(suffix: string): Promise<MaybeNull<TestElement>> {
        const testId = await this.getTestId();
        return this.locatorForOptional(`[data-test-id="${testId}${suffix}"]`)();
    }

    /** The elements whose test id starts with the field's `dataTestId` and `suffixPrefix`, leaving out error messages. */
    protected async elements(suffixPrefix: string): Promise<TestElement[]> {
        const testId = await this.getTestId();
        return this.locatorForAll(
            `[data-test-id^="${testId}${suffixPrefix}"]:not([data-test-id$="${BaseFieldHarness.ERROR_TEST_ID_SUFFIX}"])`,
        )();
    }

    /** The validation message whose test id is the field's `dataTestId`, `suffix` and "-error", or `null`. */
    protected async errorMessage(suffix: string): Promise<MaybeNull<string>> {
        const testId = await this.getTestId();
        const error = await this.locatorFor(
            FieldErrorHarness.with({ dataTestId: `${testId}${suffix}${BaseFieldHarness.ERROR_TEST_ID_SUFFIX}` }),
        )();
        return error.getMessage();
    }

    protected async input(suffix: string): Promise<NativeInputHarness> {
        const testId = await this.getTestId();
        return this.locatorFor(NativeInputHarness.with({ dataTestId: `${testId}${suffix}` }))();
    }

    protected async isElementChecked(element: TestElement): Promise<boolean> {
        const checked: unknown = await element.getProperty("checked");
        return checked === true;
    }
}

/** A field with one text input, its required marker and its validation message. */
export abstract class BaseTextFieldHarness extends BaseFieldHarness {
    public async setValue(value: string): Promise<void> {
        const input = await this.input("");
        await input.setValue(value);
    }

    public async getValue(): Promise<string> {
        const input = await this.input("");
        return input.getValue();
    }

    /** Focuses the input and leaves it without typing. */
    public async touch(): Promise<void> {
        const input = await this.input("");
        await input.touch();
    }

    public async getInputType(): Promise<string> {
        const input = await this.input("");
        return input.getType();
    }

    public async isRequiredMarked(): Promise<boolean> {
        return this.hasRequiredMarker();
    }

    /** The validation message under the input, or `null` when it shows none. */
    public async getErrorMessage(): Promise<MaybeNull<string>> {
        return this.errorMessage("");
    }
}
