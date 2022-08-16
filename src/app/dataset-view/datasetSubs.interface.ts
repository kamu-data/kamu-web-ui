import {
    DatasetDataSizeFragment,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DataViewSchema } from "../interface/search.interface";

export interface OverviewDataUpdate {
    content: Object[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: DataViewSchema;
    content: Object[];
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
