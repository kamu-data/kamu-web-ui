/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { ArrayKeysFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.harness";
import { CacheFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/cache-field/cache-field.harness";
import { CheckboxFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/checkbox-field/checkbox-field.harness";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { JsonKindFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/json-kind-field/json-kind-field.harness";
import { KeyValueFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.harness";
import { NumberFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/number-field/number-field.harness";
import { OrderFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/order-field/order-field.harness";
import { SchemaFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.harness";
import { SelectDateFormatFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/select-date-format-field/select-date-format-field.harness";
import { TopicsFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.harness";
import { TypeaheadFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/typeahead-field/typeahead-field.harness";

export class SourceFieldsHarness extends ComponentHarness {
    public static readonly hostSelector = "app-source-fields";

    private readonly locatorFields = this.locatorForAll(
        InputFieldHarness,
        TypeaheadFieldHarness,
        NumberFieldHarness,
        CheckboxFieldHarness,
        CacheFieldHarness,
        OrderFieldHarness,
        JsonKindFieldHarness,
        SchemaFieldHarness,
        SelectDateFormatFieldHarness,
        KeyValueFieldHarness,
        TopicsFieldHarness,
        ArrayKeysFieldHarness,
    );

    /** The test ids of the fields shown, in the order they appear; fields inside a shown field included. */
    public async getFieldTestIds(): Promise<string[]> {
        const fields = await this.locatorFields();
        const testIds: string[] = [];
        for (const field of fields) {
            testIds.push(await field.getTestId());
        }
        return testIds;
    }
}
