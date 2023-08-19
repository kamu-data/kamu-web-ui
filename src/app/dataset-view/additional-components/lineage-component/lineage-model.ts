import { DatasetKind } from "src/app/api/kamu.graphql.interface";

export interface LineageGraphNodeData {
    kind: LineageGraphNodeKind;
    dataObject: LineageGraphDatasetNodeObject;
}

export enum LineageGraphNodeKind {
    Dataset = "dataset",
    Source = "source",
}

export enum LineageNodeAccess {
    PRIVATE = "private",
    PUBLIC = "public",
}

export interface LineageGraphDatasetNodeObject {
    id: string;
    name: string;
    kind: DatasetKind;
    isCurrent: boolean;
    access: LineageNodeAccess;
    accountName: string;
    avatarUrl?: string;
}
