/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { MaybeNull } from "src/app/interface/app.types";
import { StopPolicyType } from "../../../dataset-settings.model";

export interface StopPolicyFormType {
    stopPolicyType: FormControl<MaybeNull<StopPolicyType>>;
    maxFailures: FormControl<number>;
}

export interface StopPolicyFormValue {
    stopPolicyType: MaybeNull<StopPolicyType>;
    maxFailures: number;
}
