import {
    DatasetDataSizeFragment,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DataViewSchema } from "../interface/search.interface";

export interface OverviewDataUpdate {
    content: DataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: DataViewSchema;
    content: DataRow[];
}

export interface MetadataSchemaUpdate {
    schema: DataViewSchema;
    metadata: DatasetMetadataDetailsFragment;
    pageInfo: PageBasedInfo;
}

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: PageBasedInfo;
}

export interface DataRow {
    [key: string]: string | number;
}
