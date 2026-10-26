/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Edge, Node } from "@swimlane/ngx-graph";

import { DatasetKind, DatasetLineageBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export enum LineageGraphNodeKind {
    Dataset = "dataset",
    Source = "source",
    Mqtt = "mqtt",
    DatasetNotAccessable = "datasetNotAccessable",
    EthereumLogs = "ethereumLogs",
    PushSource = "pushSource",
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
    avatarUrl?: MaybeNull<string>;
}

export interface LineageGraphDatasetNodeData {
    kind: LineageGraphNodeKind.Dataset;
    dataObject: LineageGraphDatasetNodeObject;
}

export interface LineageGraphInaccessibleNodeData {
    kind: LineageGraphNodeKind.DatasetNotAccessable;
}

export type LineageGraphSourceNodeKind =
    | LineageGraphNodeKind.Source
    | LineageGraphNodeKind.Mqtt
    | LineageGraphNodeKind.EthereumLogs
    | LineageGraphNodeKind.PushSource;

export interface LineageGraphSourceNodeData {
    kind: LineageGraphSourceNodeKind;
}

export type LineageGraphNodeData =
    LineageGraphDatasetNodeData | LineageGraphInaccessibleNodeData | LineageGraphSourceNodeData;

export interface LineageGraphNode extends Node {
    data: LineageGraphNodeData;
}

export interface LineageGraphDatasetNode extends LineageGraphNode {
    data: LineageGraphDatasetNodeData;
}

export interface LineageGraph {
    nodes: LineageGraphNode[];
    links: Edge[];
}

export interface LineageGraphUpdate {
    graph: LineageGraph;
    originDataset: DatasetLineageBasicsFragment;
}
