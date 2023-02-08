import { DatasetPageInfoFragment } from "./../api/kamu.graphql.interface";
import {
    DatasetBasicsFragment,
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DataRow, DatasetSchema } from "../interface/dataset.interface";
import { MaybeNull } from "../common/app.types";

export interface OverviewDataUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
}

export interface DataSqlErrorUpdate {
    error: string;
}

export interface MetadataSchemaUpdate {
    schema: MaybeNull<DatasetSchema>;
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
