/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";
import { IngestTriggerFormType, IngestTriggerFormValue } from "./ingest-trigger-form/ingest-trigger-form.types";
import { StopPolicyFormType, StopPolicyFormValue } from "./stop-policy-form/stop-policy-form.types";

export interface SchedulingSettingsFormType {
    updatesEnabled: FormControl<boolean>;
    ingestTrigger: FormGroup<IngestTriggerFormType>;
    stopPolicy: FormGroup<StopPolicyFormType>;
}

export interface SchedulingSettingsFormValue {
    updatesEnabled: boolean;
    ingestTrigger: IngestTriggerFormValue;
    stopPolicy: StopPolicyFormValue;
}
