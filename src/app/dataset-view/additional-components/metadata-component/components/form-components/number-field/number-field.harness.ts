/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { MaybeNull } from "@interface/app.types";

import { BaseTextFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class NumberFieldHarness extends BaseTextFieldHarness {
    public static readonly hostSelector = "app-number-field";

    /** The input's `min` and `max` attributes; `null` for one it doesn't have. */
    public async getRange(): Promise<{ min: MaybeNull<string>; max: MaybeNull<string> }> {
        const input = await this.element("");
        const min = await input.getAttribute("min");
        const max = await input.getAttribute("max");
        return { min, max };
    }
}
