/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowConfigRuleIngestDataFragment, FlowRetryPolicyDataFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface DatasetSettingsIngestConfigurationTabData extends DatasetViewData {
    ingestionRule: FlowConfigRuleIngestDataFragment;
    retryPolicy: MaybeNull<FlowRetryPolicyDataFragment>;
}
