/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { isRecord } from "@common/helpers/app.helpers";
import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowsCategoryUnion } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

/** History state of the Data tab: the offset range its first query selects. */
export interface DatasetOffsetRangeState {
    start: string | number;
    end: string | number;
}

export function isDatasetOffsetRangeState(state: unknown): state is DatasetOffsetRangeState {
    return isRecord(state) && isOffset(state.start) && isOffset(state.end);
}

function isOffset(value: unknown): value is string | number {
    return typeof value === "string" || typeof value === "number";
}

export interface DatasetNavigationParams {
    accountName: string;
    datasetName: string;
    tab?: string;
    page?: number;
    section?: string;
    state?: DatasetOffsetRangeState;
    sqlQuery?: string;
    webhookId?: string[];
    category?: FlowsCategoryUnion;
    webhooksState?: FlowProcessEffectiveState[];
    pathPrefix?: string;
    version?: string;
    fragment?: string;
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
