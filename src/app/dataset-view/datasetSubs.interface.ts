import {
    DatasetDataSizeFragment,
    DatasetMetadataDetailsFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DataViewSchema } from "../interface/search.interface";

export interface OverviewDataUpdate {
    content: ObjectInterface[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: DataViewSchema;
    content: ObjectInterface[];
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

export type DataRow = Record<string, unknown>;

export interface ObjectInterface {
    [key: string]: string | number;
}
