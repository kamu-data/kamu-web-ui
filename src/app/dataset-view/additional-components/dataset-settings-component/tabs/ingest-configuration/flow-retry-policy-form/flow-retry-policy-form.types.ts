/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { TimeDeltaFormType } from "@common/components/time-delta-form/time-delta-form.value";
import { FlowRetryBackoffType, TimeDeltaInput } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export interface FlowRetryPolicyFormValue {
    retriesEnabled: boolean;
    backoffType: FlowRetryBackoffType;
    maxAttempts: number;
    minDelay: TimeDeltaInput;
}

export interface FlowRetryPolicyFormType {
    retriesEnabled: FormControl<MaybeNull<boolean>>;
    backoffType: FormControl<MaybeNull<FlowRetryBackoffType>>;
    maxAttempts: FormControl<MaybeNull<number>>;
    minDelay: FormGroup<TimeDeltaFormType>;
}
