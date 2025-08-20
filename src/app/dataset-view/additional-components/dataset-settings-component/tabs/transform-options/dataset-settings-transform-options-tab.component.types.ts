/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormGroup } from "@angular/forms";
import {
    TransformTriggerFormType,
    TransformTriggerFormValue,
} from "./transform-trigger-form/transform-trigger-form.types";

export interface TransformSettingsFormType {
    transformTrigger: FormGroup<TransformTriggerFormType>;
}

export interface TransformSettingsFormValue {
    transformTrigger: TransformTriggerFormValue;
}
