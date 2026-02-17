/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import { TimeDeltaFormType } from "@common/components/time-delta-form/time-delta-form.value";
import { FlowRetryBackoffType, TimeDelta } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

export interface FlowRetryPolicyFormValue {
    retriesEnabled: boolean;
    backoffType: FlowRetryBackoffType;
    maxAttempts: number;
    minDelay: TimeDelta;
}

export interface FlowRetryPolicyFormType {
    retriesEnabled: FormControl<MaybeNull<boolean>>;
    backoffType: FormControl<MaybeNull<FlowRetryBackoffType>>;
    maxAttempts: FormControl<MaybeNull<number>>;
    minDelay: FormGroup<TimeDeltaFormType>;
}
