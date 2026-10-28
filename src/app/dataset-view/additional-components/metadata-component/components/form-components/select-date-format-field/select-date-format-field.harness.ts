/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { TestElement } from "@angular/cdk/testing";

import { requireValue } from "@common/helpers/app.helpers";
import { MaybeNull } from "@interface/app.types";

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { TypeaheadFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.harness";
import { EventTimeSourceKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export class SelectDateFormatFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-select-date-format-field";

    private static readonly KIND_TEST_IDS: Record<EventTimeSourceKind, string> = {
        [EventTimeSourceKind.FROM_METADATA]: "event-time-from-metadata",
        [EventTimeSourceKind.FROM_SYSTEM_TIME]: "event-time-from-system-time",
        [EventTimeSourceKind.FROM_PATH]: "event-time-from-path",
    };
    private static readonly PATTERN_TEST_ID = "event-time-pattern";
    private static readonly TIMESTAMP_FORMAT_TEST_ID = "event-time-timestamp-format";

    private readonly locatorPattern = this.locatorForOptional(
        InputFieldHarness.with({ dataTestId: SelectDateFormatFieldHarness.PATTERN_TEST_ID }),
    );
    private readonly locatorTimestampFormat = this.locatorForOptional(
        TypeaheadFieldHarness.with({ dataTestId: SelectDateFormatFieldHarness.TIMESTAMP_FORMAT_TEST_ID }),
    );

    public async selectKind(kind: EventTimeSourceKind): Promise<void> {
        const radio = await this.kindRadio(kind);
        await radio.click();
    }

    public async isKindSelected(kind: EventTimeSourceKind): Promise<boolean> {
        const radio = await this.kindRadio(kind);
        return this.isElementChecked(radio);
    }

    /** Whether the pattern and timestamp format inputs are shown, as they are for "From path". */
    public async hasPatternFields(): Promise<boolean> {
        const pattern = await this.locatorPattern();
        const timestampFormat = await this.locatorTimestampFormat();
        return pattern !== null && timestampFormat !== null;
    }

    public async setPattern(value: string): Promise<void> {
        const pattern = await this.patternField();
        await pattern.setValue(value);
    }

    public async touchPattern(): Promise<void> {
        const pattern = await this.patternField();
        await pattern.touch();
    }

    public async getPatternErrorMessage(): Promise<MaybeNull<string>> {
        const pattern = await this.patternField();
        return pattern.getErrorMessage();
    }

    public async setTimestampFormat(value: string): Promise<void> {
        const timestampFormat = await this.timestampFormatField();
        await timestampFormat.setValue(value);
    }

    private async patternField(): Promise<InputFieldHarness> {
        return requireValue(await this.locatorPattern(), "The pattern input is not shown");
    }

    private async timestampFormatField(): Promise<TypeaheadFieldHarness> {
        return requireValue(await this.locatorTimestampFormat(), "The timestamp format input is not shown");
    }

    private async kindRadio(kind: EventTimeSourceKind): Promise<TestElement> {
        return this.locatorFor(`[data-test-id="${SelectDateFormatFieldHarness.KIND_TEST_IDS[kind]}"]`)();
    }
}
