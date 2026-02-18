/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField, DatasetSchema } from "@interface/dataset-schema.interface";

import { QueryExplainerProofResponse } from "src/app/query-explainer/query-explainer.types";

export interface GlobalQuerySearchItem {
    datasetAlias: string;
    schema: MaybeNull<DatasetSchema>;
}

export interface SqlQueryResponseState {
    schema: MaybeNull<DatasetSchema>;
    content: DynamicTableDataRow[];
    involvedDatasetsId: string[];
}

export interface SqlQueryBasicResponse {
    schema: DataSchemaField[];
    content: DynamicTableDataRow[];
    involvedDatasetsId: string[];
    proofResponse?: QueryExplainerProofResponse;
}
