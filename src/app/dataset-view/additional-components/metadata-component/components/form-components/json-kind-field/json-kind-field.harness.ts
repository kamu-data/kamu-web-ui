/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";
import { ReadKind } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export class JsonKindFieldHarness extends BaseFieldHarness {
    public static readonly hostSelector = "app-json-kind-field";

    public async selectKind(kind: ReadKind): Promise<void> {
        const radio = await this.element(`-${kind}`);
        await radio.click();
    }

    public async isKindSelected(kind: ReadKind): Promise<boolean> {
        const radio = await this.element(`-${kind}`);
        return this.isElementChecked(radio);
    }

    /** Whether the field offers `kind` as an option. */
    public async hasKind(kind: ReadKind): Promise<boolean> {
        const radio = await this.optionalElement(`-${kind}`);
        return radio !== null;
    }
}
