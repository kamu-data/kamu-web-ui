/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormGroup } from "@angular/forms";

import {
    FlowRetryPolicyFormType,
    FlowRetryPolicyFormValue,
} from "./flow-retry-policy-form/flow-retry-policy-form.types";
import {
    IngestConfigurationRuleFormType,
    IngestConfigurationRuleFormValue,
} from "./ingest-configuration-rule-form/ingest-configuration-rule-form.types";

export interface IngestConfigurationFormType {
    ingestConfig: FormGroup<IngestConfigurationRuleFormType>;
    flowRetryPolicy: FormGroup<FlowRetryPolicyFormType>;
}

export interface IngestConfigurationFormValue {
    ingestConfig: IngestConfigurationRuleFormValue;
    flowRetryPolicy: FlowRetryPolicyFormValue;
}
