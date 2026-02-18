/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { TimeDeltaFormType, TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { MaybeNull } from "@interface/app.types";

export interface BufferingBatchingRuleFormType {
    minRecordsToAwait: FormControl<MaybeNull<number>>;
    maxBatchingInterval: FormGroup<TimeDeltaFormType>;
}

export interface BufferingBatchingRuleFormValue {
    minRecordsToAwait: MaybeNull<number>;
    maxBatchingInterval: TimeDeltaFormValue;
}
