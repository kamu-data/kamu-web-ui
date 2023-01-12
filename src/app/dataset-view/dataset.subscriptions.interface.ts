import { DatasetPageInfoFragment } from "./../api/kamu.graphql.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DataRow, DatasetSchema } from "../interface/dataset.interface";

export interface OverviewDataUpdate {
    schema: DatasetSchema;
    content: DataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: DatasetSchema;
    content: DataRow[];
}

export interface DataSqlErrorUpdate {
    error: string;
}

export interface MetadataSchemaUpdate {
    schema: DatasetSchema;
    metadata: DatasetMetadataSummaryFragment;
    pageInfo: DatasetPageInfoFragment;
}

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: DatasetPageInfoFragment;
}

export interface LineageUpdate {
    nodes: DatasetBasicsFragment[];
    edges: DatasetBasicsFragment[][];
    origin: DatasetBasicsFragment;
}
