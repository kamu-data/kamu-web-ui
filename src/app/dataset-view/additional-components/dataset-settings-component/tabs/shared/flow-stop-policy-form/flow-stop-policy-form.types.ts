/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

import { MaybeNull } from "src/app/interface/app.types";

import { FlowTriggerStopPolicyType } from "../../../dataset-settings.model";

export interface FlowStopPolicyFormType {
    stopPolicyType: FormControl<MaybeNull<FlowTriggerStopPolicyType>>;
    maxFailures: FormControl<number>;
}

export interface FlowStopPolicyFormValue {
    stopPolicyType: MaybeNull<FlowTriggerStopPolicyType>;
    maxFailures: number;
}
