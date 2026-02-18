/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import {
    FlowStopPolicyFormType,
    FlowStopPolicyFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-stop-policy-form/flow-stop-policy-form.types";
import {
    TransformTriggerFormType,
    TransformTriggerFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/transform-trigger-form/transform-trigger-form.types";

export interface TransformSettingsFormType {
    updatesEnabled: FormControl<boolean>;
    transformTrigger: FormGroup<TransformTriggerFormType>;
    stopPolicy: FormGroup<FlowStopPolicyFormType>;
}

export interface TransformSettingsFormValue {
    updatesEnabled: boolean;
    transformTrigger: TransformTriggerFormValue;
    stopPolicy: FlowStopPolicyFormValue;
}
