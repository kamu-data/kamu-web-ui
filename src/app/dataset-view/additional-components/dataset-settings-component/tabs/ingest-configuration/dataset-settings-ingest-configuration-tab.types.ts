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
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/flow-retry-policy-form/flow-retry-policy-form.types";
import {
    IngestConfigurationRuleFormType,
    IngestConfigurationRuleFormValue,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/ingest-configuration-rule-form/ingest-configuration-rule-form.types";

export interface IngestConfigurationFormType {
    ingestConfig: FormGroup<IngestConfigurationRuleFormType>;
    flowRetryPolicy: FormGroup<FlowRetryPolicyFormType>;
}

export interface IngestConfigurationFormValue {
    ingestConfig: IngestConfigurationRuleFormValue;
    flowRetryPolicy: FlowRetryPolicyFormValue;
}
