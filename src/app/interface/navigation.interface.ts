/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowDetailsTabs } from "../dataset-flow/dataset-flow-details/dataset-flow-details.types";

export interface DatasetNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    page?: number;
    section?: string;
    state?: object;
    sqlQuery?: string;
    webhookId?: string[];
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
}
