import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
    PageBasedInfo,
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
    metadata: DatasetMetadataDetailsFragment;
    pageInfo: PageBasedInfo;
}

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: PageBasedInfo;
}

export interface LineageUpdate {
    nodes: DatasetBasicsFragment[];
    edges: DatasetBasicsFragment[][];
    origin: DatasetBasicsFragment;
}
