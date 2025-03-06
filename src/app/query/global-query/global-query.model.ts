/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../interface/app.types";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";

export interface GlobalQuerySearchItem {
    datasetAlias: string;
    schema: MaybeNull<DatasetSchema>;
}

export interface SqlQueryResponseState {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
    involvedDatasetsId: string[];
}
