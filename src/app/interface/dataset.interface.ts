/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetLineageBasicsFragment,
    DatasetSearchOverviewFragment,
    DependencyDatasetResultNotAccessible,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";

export interface DataRow {
    [key: string]: {
        value: string | number;
        cssClass: string;
    };
}

export interface DatasetLineageNode {
    basics: DatasetLineageBasicsFragment | DependencyDatasetResultNotAccessible;
    downstreamDependencies: DatasetLineageNode[];
    upstreamDependencies: DatasetLineageNode[];
}

export interface DatasetSchema {
    name: string;
    type: string;
    fields: DataSchemaField[];
}

export interface DataSchemaField {
    name: string;
    repetition: string;
    type: string;
    logicalType?: string;
}

export enum OperationColumnClassEnum {
    SECONDARY_COLOR = "secondary-color",
    ERROR_COLOR = "error-color",
    PRIMARY_COLOR = "primary-color",
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
    limit?: number;
    skip?: number;
}
