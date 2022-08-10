import {
    MetadataBlockFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DataViewSchema } from "../interface/search.interface";

export interface DatasetHistoryUpdate {
    history: MetadataBlockFragment[];
    pageInfo: PageBasedInfo;
}

export interface MetadataSchemaUpdate {
    schema: DataViewSchema;
    pageInfo: PageBasedInfo;
}
