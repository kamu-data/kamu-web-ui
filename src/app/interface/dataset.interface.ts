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
import { OdfExtraAttributes, OdfTypes } from "../common/components/dynamic-table/dynamic-table.interface";

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
    fields: DataSchemaField[];
}

export interface DataSchemaField {
    name: string;
    type: DataSchemaTypeField;
    extra?: {
        [OdfExtraAttributes.EXTRA_ATTRIBUTE_DESCRIPTION]: string;
        [OdfExtraAttributes.EXTRA_ATTRIBUTE_TYPE]: {
            kind: string;
        };
        [key: string]: string | Record<string, unknown>;
    };
}

export interface DataSchemaTypeField {
    kind: OdfTypes;
    unit?: string;
    timezone?: string;
    inner?: DataSchemaTypeField;
    itemType?: DataSchemaTypeField;
    keyType?: {
        kind: string;
    };
    valueType?: {
        kind: string;
    };
    fields?: DataSchemaField[];
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
    enabledProof?: boolean;
    limit?: number;
    skip?: number;
}
