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
        value: string | number | DataSchemaField;
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

interface DataSchemaBaseField {
    kind: OdfTypes;
}

interface DataSchemaOptionField extends DataSchemaBaseField {
    kind: OdfTypes.Option;
    inner: DataSchemaTypeField;
}
interface DataSchemaNullField extends DataSchemaBaseField {
    kind: OdfTypes.Null;
    inner?: DataSchemaTypeField;
}
interface DataSchemaListField extends DataSchemaBaseField {
    kind: OdfTypes.List;
    itemType: DataSchemaTypeField;
}
interface DataSchemaTimeField extends DataSchemaBaseField {
    kind: OdfTypes.Timestamp | OdfTypes.Duration | OdfTypes.Time;
    unit: string;
    timezone?: string;
}
interface DataSchemaMapField extends DataSchemaBaseField {
    kind: OdfTypes.Map;
    keyType: { kind: string };
    valueType: { kind: string };
}
interface DataSchemaStructField extends DataSchemaBaseField {
    kind: OdfTypes.Struct;
    fields: { name: string; type: DataSchemaTypeField }[];
}
interface DataSchemaDefaultField extends DataSchemaBaseField {
    kind: Exclude<
        OdfTypes,
        | OdfTypes.Option
        | OdfTypes.Null
        | OdfTypes.List
        | OdfTypes.Timestamp
        | OdfTypes.Duration
        | OdfTypes.Time
        | OdfTypes.Map
        | OdfTypes.Struct
    >;
}

export type DataSchemaTypeField =
    | DataSchemaOptionField
    | DataSchemaNullField
    | DataSchemaListField
    | DataSchemaTimeField
    | DataSchemaMapField
    | DataSchemaStructField
    | DataSchemaDefaultField;

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
