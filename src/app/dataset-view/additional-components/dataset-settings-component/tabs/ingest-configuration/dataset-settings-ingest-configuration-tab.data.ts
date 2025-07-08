/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";
import { FlowConfigRuleIngest, FlowRetryPolicy } from "src/app/api/kamu.graphql.interface";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface DatasetSettingsIngestConfigurationTabData extends DatasetViewData {
    ingestionRule: FlowConfigRuleIngest;
    retryPolicy: FlowRetryPolicy | null;
}

export interface IngestConfigurationRuleFormType {
    fetchUncacheable: FormControl<boolean>;
}
