/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetLineageBasicsFragment, DatasetPageInfoFragment, SetVocab } from "../api/kamu.graphql.interface";
import {
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DatasetSchema } from "src/app/interface/dataset-schema.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { DynamicTableDataRow } from "../common/components/dynamic-table/dynamic-table.interface";

export interface OverviewUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DynamicTableDataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DynamicTableDataRow[];
    currentVocab?: SetVocab;
}

export interface DataSqlErrorUpdate {
    error: string;
}

export interface MetadataSchemaUpdate {
    schema: MaybeNull<DatasetSchema>;
    metadataSummary: DatasetMetadataSummaryFragment;
    pageInfo: DatasetPageInfoFragment;
}

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: DatasetPageInfoFragment;
}

export interface LineageUpdate {
    nodes: DatasetLineageBasicsFragment[];
    edges: DatasetLineageBasicsFragment[][];
    origin: DatasetLineageBasicsFragment;
}
