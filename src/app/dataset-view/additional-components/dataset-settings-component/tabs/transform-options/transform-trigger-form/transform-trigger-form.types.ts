/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { FlowTriggerBreakingChangeRule } from "@api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

import { BatchingRuleType } from "../../../dataset-settings.model";
import {
    BufferingBatchingRuleFormType,
    BufferingBatchingRuleFormValue,
} from "../buffering-batching-rule-form/buffering-batching-rule-form.types";

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
