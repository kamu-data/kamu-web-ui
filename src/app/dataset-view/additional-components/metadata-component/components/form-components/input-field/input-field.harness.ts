/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseTextFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/base-field.harness";

export class InputFieldHarness extends BaseTextFieldHarness {
    public static readonly hostSelector = "app-input-field";
}
