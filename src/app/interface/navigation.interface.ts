/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export interface DatasetNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    page?: number;
    section?: string;
    state?: object;
    sqlQuery?: string;
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
}
