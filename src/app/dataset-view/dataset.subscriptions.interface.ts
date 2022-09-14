import { DatasetPageInfoFragment } from "./../api/kamu.graphql.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataDataFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DataRow, DatasetSchema } from "../interface/dataset.interface";

export interface OverviewDataUpdate {
    content: DataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: DatasetSchema;
    content: DataRow[];
}

export interface MetadataSchemaUpdate {
    schema: DatasetSchema;
    metadata: DatasetMetadataDataFragment;
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
