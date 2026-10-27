/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { TimeDeltaFormType, TimeDeltaFormValue } from "@common/components/time-delta-form/time-delta-form.value";
import { FlowRetryBackoffType } from "@api/kamu.graphql.interface";

export interface FlowRetryPolicyFormValue {
    retriesEnabled: boolean;
    backoffType: FlowRetryBackoffType;
    maxAttempts: number;
    minDelay: TimeDeltaFormValue;
}

export interface FlowRetryPolicyFormType {
    retriesEnabled: FormControl<boolean>;
    backoffType: FormControl<FlowRetryBackoffType>;
    maxAttempts: FormControl<number>;
    minDelay: FormGroup<TimeDeltaFormType>;
}
