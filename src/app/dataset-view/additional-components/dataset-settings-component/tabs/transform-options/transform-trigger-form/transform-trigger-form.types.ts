/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { BatchingRuleType } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import {
    BufferingBatchingRuleFormType,
    BufferingBatchingRuleFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/buffering-batching-rule-form/buffering-batching-rule-form.types";

import { FlowTriggerBreakingChangeRule } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export interface TransformTriggerFormType {
    forNewData: FormGroup<BatchingRuleFormType>;
    forBreakingChange: FormControl<MaybeNull<FlowTriggerBreakingChangeRule>>;
}

export interface TransformTriggerFormValue {
    forNewData: BatchingRuleFormValue;
    forBreakingChange: MaybeNull<FlowTriggerBreakingChangeRule>;
}

export interface BatchingRuleFormType {
    batchingRuleType: FormControl<MaybeNull<BatchingRuleType>>;
    buffering: FormGroup<BufferingBatchingRuleFormType>;
}

export interface BatchingRuleFormValue {
    batchingRuleType: MaybeNull<BatchingRuleType>;
    buffering?: BufferingBatchingRuleFormValue;
}
