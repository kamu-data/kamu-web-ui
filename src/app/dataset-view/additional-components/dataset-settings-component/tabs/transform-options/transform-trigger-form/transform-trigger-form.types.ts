/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";
import { TimeDeltaFormType, TimeDeltaFormValue } from "src/app/common/components/time-delta-form/time-delta-form.value";
import { BatchingRuleType } from "../../../dataset-settings.model";
import { FlowTriggerBreakingChangeRule } from "src/app/api/kamu.graphql.interface";

export interface TransformTriggerFormType {
    updatesEnabled: FormControl<boolean>;
    forNewData: FormGroup<ReactiveTriggerFormType>;
    forBreakingChange: FormControl<MaybeNull<FlowTriggerBreakingChangeRule>>;
}

export interface TransformTriggerFormValue {
    updatesEnabled: boolean;
    forNewData: ReactiveTriggerFormValue;
    forBreakingChange: MaybeNull<FlowTriggerBreakingChangeRule>;
}

export interface ReactiveTriggerFormType {
    batchingRuleType: FormControl<BatchingRuleType>;
    buffering: FormGroup<BufferingBatchingRuleFormType>;
}

export interface ReactiveTriggerFormValue {
    batchingRuleType: BatchingRuleType;
    buffering?: BufferingBatchingRuleFormValue;
}

export interface BufferingBatchingRuleFormType {
    minRecordsToAwait: FormControl<MaybeNull<number>>;
    maxBatchingInterval: FormGroup<TimeDeltaFormType>;
}

export interface BufferingBatchingRuleFormValue {
    minRecordsToAwait: MaybeNull<number>;
    maxBatchingInterval: TimeDeltaFormValue;
}
