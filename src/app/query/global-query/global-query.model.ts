/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { QueryExplainerProofResponse } from "src/app/query-explainer/query-explainer.types";
import { MaybeNull } from "../../interface/app.types";
import { DataRow, DataSchemaField, DatasetSchema } from "src/app/interface/dataset.interface";

export interface GlobalQuerySearchItem {
    datasetAlias: string;
    schema: MaybeNull<DatasetSchema>;
}

export interface SqlQueryResponseState {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
    involvedDatasetsId: string[];
}

export interface SqlQueryRestResponseState {
    schema: DataSchemaField[];
    content: DataRow[];
    involvedDatasetsId: string[];
    proofResponse?: QueryExplainerProofResponse;
}
