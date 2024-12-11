import { DatasetLineageBasicsFragment, DatasetPageInfoFragment, SetVocab } from "../api/kamu.graphql.interface";
import {
    DatasetDataSizeFragment,
    DatasetMetadataSummaryFragment,
    DatasetOverviewFragment,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { DataRow, DatasetSchema } from "../interface/dataset.interface";
import { MaybeNull } from "../common/app.types";
import { DatasetInfo } from "../interface/navigation.interface";

export interface OverviewUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
    overview: DatasetOverviewFragment;
    size: DatasetDataSizeFragment;
}

export interface DataUpdate {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
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
    datasetInfo: DatasetInfo;
}

export interface LineageUpdate {
    nodes: DatasetLineageBasicsFragment[];
    edges: DatasetLineageBasicsFragment[][];
    origin: DatasetLineageBasicsFragment;
}
