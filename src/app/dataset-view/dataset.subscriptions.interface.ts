import {
    CurrentSourceFetchUrlFragment,
    DatasetKind,
    DatasetPageInfoFragment,
    SetVocab,
} from "../api/kamu.graphql.interface";
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
    currentVocab?: SetVocab;
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
    kind?: DatasetKind;
}

export type DatasetLineageBasics = DatasetBasicsFragment & { metadata: CurrentSourceFetchUrlFragment };

export interface LineageUpdate {
    nodes: DatasetLineageBasics[];
    edges: DatasetLineageBasics[][];
    origin: DatasetLineageBasics;
}

export interface LineageGraphNodeData {
    nodeKind: LineageGraphNodeType;
    nodeDataObject: LineageGraphDatasetNodeObject;
}

export enum LineageGraphNodeType {
    Dataset = "dataset",
    Source = "source",
}

export interface LineageGraphDatasetNodeObject {
    id: string;
    name: string;
    kind: DatasetKind;
    isRoot: boolean;
    isCurrent: boolean;
    access: string;
    accountName: string;
}
