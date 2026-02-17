/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl, FormGroup } from "@angular/forms";

import {
    FlowStopPolicyFormType,
    FlowStopPolicyFormValue,
} from "../shared/flow-stop-policy-form/flow-stop-policy-form.types";
import { IngestTriggerFormType, IngestTriggerFormValue } from "./ingest-trigger-form/ingest-trigger-form.types";

export interface SchedulingSettingsFormType {
    updatesEnabled: FormControl<boolean>;
    ingestTrigger: FormGroup<IngestTriggerFormType>;
    stopPolicy: FormGroup<FlowStopPolicyFormType>;
}

export interface SchedulingSettingsFormValue {
    updatesEnabled: boolean;
    ingestTrigger: IngestTriggerFormValue;
    stopPolicy: FlowStopPolicyFormValue;
}
