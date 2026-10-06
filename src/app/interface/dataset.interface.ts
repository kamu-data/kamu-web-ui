/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetAccessResultNotAccessible,
    DatasetLineageBasicsFragment,
    DatasetSearchOverviewFragment,
    PageBasedInfo,
} from "@api/kamu.graphql.interface";

export interface DatasetLineageNode {
    basics: DatasetLineageBasicsFragment | DatasetAccessResultNotAccessible;
    downstreamDependencies: DatasetLineageNode[];
    upstreamDependencies: DatasetLineageNode[];
}

export interface DatasetsAccountResponse {
    datasets: DatasetSearchOverviewFragment[];
    pageInfo: PageBasedInfo;
    datasetTotalCount: number;
}

export interface DatasetsAccountResolverResponse {
    datasetsResponse: DatasetsAccountResponse;
    accountName: string;
}

export interface DatasetRequestBySql {
    query: string;
    enabledProof?: boolean;
    limit?: number;
    skip?: number;
}
