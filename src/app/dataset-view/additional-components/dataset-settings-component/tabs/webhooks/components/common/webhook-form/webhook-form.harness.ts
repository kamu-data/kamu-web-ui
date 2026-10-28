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

export class WebhookFormHarness extends ComponentHarness {
    public static readonly hostSelector = "app-webhook-form";

    private static readonly TARGET_URL_INPUT_TEST_ID = "target-url";
    private static readonly TARGET_URL_ERROR_TEST_ID = "target-url-error";
    private static readonly TARGET_URL_HINT_TEST_ID = "target-url-hint";
    private static readonly EVENT_TYPES_SELECT_TEST_ID = "event-types";
    private static readonly EVENT_TYPE_OPTION_TEST_ID_PREFIX = "event-type-option-";
    private static readonly EVENT_TYPES_ERROR_TEST_ID = "event-types-error";
    private static readonly LABEL_INPUT_TEST_ID = "webhook-label";
    private static readonly LABEL_ERROR_TEST_ID = "label-error";

    private readonly locatorTargetUrlInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: WebhookFormHarness.TARGET_URL_INPUT_TEST_ID }),
    );
    private readonly locatorTargetUrlError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: WebhookFormHarness.TARGET_URL_ERROR_TEST_ID }),
    );
    private readonly locatorTargetUrlHint = this.locatorFor(
        `[data-test-id="${WebhookFormHarness.TARGET_URL_HINT_TEST_ID}"]`,
    );
    private readonly locatorEventTypesContainer = this.locatorFor(
        `[data-test-id="${WebhookFormHarness.EVENT_TYPES_SELECT_TEST_ID}"] .ng-select-container`,
    );
    private readonly locatorEventTypesInput = this.locatorFor(
        `[data-test-id="${WebhookFormHarness.EVENT_TYPES_SELECT_TEST_ID}"] input`,
    );
    private readonly locatorSelectedEventTypes = this.locatorForAll(
        `[data-test-id="${WebhookFormHarness.EVENT_TYPES_SELECT_TEST_ID}"] .ng-value-label`,
    );
    private readonly locatorEventTypesError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: WebhookFormHarness.EVENT_TYPES_ERROR_TEST_ID }),
    );
    private readonly locatorLabelInput = this.locatorFor(
        NativeInputHarness.with({ dataTestId: WebhookFormHarness.LABEL_INPUT_TEST_ID }),
    );
    private readonly locatorLabelError = this.locatorFor(
        FieldErrorHarness.with({ dataTestId: WebhookFormHarness.LABEL_ERROR_TEST_ID }),
    );

    public async setTargetUrl(url: string): Promise<void> {
        const input = await this.locatorTargetUrlInput();
        await input.setValue(url);
    }

    public async getTargetUrl(): Promise<string> {
        const input = await this.locatorTargetUrlInput();
        return input.getValue();
    }

    public async getTargetUrlError(): Promise<MaybeNull<string>> {
        const error = await this.locatorTargetUrlError();
        return error.getMessage();
    }

    public async getTargetUrlHint(): Promise<string> {
        const hint = await this.locatorTargetUrlHint();
        return hint.text();
    }

    /** Picks an event type, by its value, from the dropdown. */
    public async selectEventType(value: string): Promise<void> {
        // ng-select opens its panel on a mousedown on its container, not on its host element
        const container = await this.locatorEventTypesContainer();
        await container.click();
        const option = await this.locatorFor(
            `[data-test-id="${WebhookFormHarness.EVENT_TYPE_OPTION_TEST_ID_PREFIX}${value}"]`,
        )();
        await option.click();
        const input = await this.locatorEventTypesInput();
        await input.blur();
    }

    /** The names of the chosen event types. */
    public async getSelectedEventTypes(): Promise<string[]> {
        const labels = await this.locatorSelectedEventTypes();
        const names: string[] = [];
        for (const label of labels) {
            const text = await label.text();
            names.push(text.trim());
        }
        return names;
    }

    /** Focuses the event type dropdown and leaves it without choosing. */
    public async touchEventTypes(): Promise<void> {
        const input = await this.locatorEventTypesInput();
        await input.focus();
        await input.blur();
    }

    public async getEventTypesError(): Promise<MaybeNull<string>> {
        const error = await this.locatorEventTypesError();
        return error.getMessage();
    }

    public async setLabel(label: string): Promise<void> {
        const input = await this.locatorLabelInput();
        await input.setValue(label);
    }

    public async getLabel(): Promise<string> {
        const input = await this.locatorLabelInput();
        return input.getValue();
    }

    public async getLabelError(): Promise<MaybeNull<string>> {
        const error = await this.locatorLabelError();
        return error.getMessage();
    }

    public async isReadonly(): Promise<boolean> {
        const input = await this.locatorTargetUrlInput();
        const host = await input.host();
        const readonly: unknown = await host.getProperty("readOnly");
        return readonly === true;
    }
}
