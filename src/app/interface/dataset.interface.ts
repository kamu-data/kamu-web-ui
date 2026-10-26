/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetAccessResultNotAccessibleDataFragment,
    DatasetLineageBasicsFragment,
    DatasetPageInfoFragment,
    DatasetSearchOverviewFragment,
} from "@api/kamu.graphql.interface";

/** A dataset in the lineage graph: its basics when the user can access it, only its ID otherwise */
export type DatasetLineageEntry = DatasetLineageBasicsFragment | DatasetAccessResultNotAccessibleDataFragment;

export interface DatasetLineageNode {
    basics: DatasetLineageEntry;
    downstreamDependencies: DatasetLineageNode[];
    upstreamDependencies: DatasetLineageNode[];
}

export interface DatasetsAccountResponse {
    datasets: DatasetSearchOverviewFragment[];
    pageInfo: DatasetPageInfoFragment;
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
