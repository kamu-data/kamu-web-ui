import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DataViewSchema } from "../interface/search.interface";

export interface OverviewDataUpdate {
    content: Object[];
}

export interface DataUpdate {
    schema: DataViewSchema;
    content: Object[];
}

export interface MetadataSchemaUpdate {
    schema: DataViewSchema;
    pageInfo: PageBasedInfo;
}

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: PageBasedInfo;
}
