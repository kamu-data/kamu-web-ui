/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowsCategoryUnion } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";

export interface DatasetNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    page?: number;
    section?: string;
    state?: object;
    sqlQuery?: string;
    webhookId?: string[];
    category?: FlowsCategoryUnion;
    webhooksState?: FlowProcessEffectiveState[];
}
export interface DatasetInfo {
    accountName: string;
    datasetName: string;
}

export interface MetadataBlockNavigationParams {
    accountName: string;
    datasetName: string;
    blockHash: string;
}

export interface FlowDetailsNavigationParams {
    accountName: string;
    datasetName: string;
    flowId: string;
    tab?: FlowDetailsTabs;
}

export interface WebhooksNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    webhookId?: string;
}
