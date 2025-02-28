/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Edge, Node } from "@swimlane/ngx-graph";
import { DatasetKind, DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";

export interface LineageGraphNodeData {
    kind: LineageGraphNodeKind;
    dataObject: LineageGraphDatasetNodeObject;
}

export enum LineageGraphNodeKind {
    Dataset = "dataset",
    Source = "source",
    Mqtt = "mqtt",
    DatasetNotAccessable = "datasetNotAccessable",
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

export interface LineageGraph {
    nodes: Node[];
    links: Edge[];
}

export interface LineageGraphUpdate {
    graph: LineageGraph;
    originDataset: DatasetLineageBasicsFragment;
}
