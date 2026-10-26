/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Edge } from "@swimlane/ngx-graph";

import { MOCK_CURRENT_DATASET_NODE } from "@api/mock/dataset.mock";

import {
    LineageGraph,
    LineageGraphNode,
    LineageGraphNodeKind,
    LineageGraphSourceNodeKind,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

function mockSourceNode(kind: LineageGraphSourceNodeKind, label: string): LineageGraphNode {
    return {
        id: `source-node-${kind}`,
        label,
        data: { kind },
    };
}

export const MOCK_SOURCE_NODES: LineageGraphNode[] = [
    mockSourceNode(LineageGraphNodeKind.Source, "example.com"),
    mockSourceNode(LineageGraphNodeKind.Mqtt, "test.mosquitto.org:1883"),
    mockSourceNode(LineageGraphNodeKind.EthereumLogs, "mainnet"),
    mockSourceNode(LineageGraphNodeKind.PushSource, "default"),
];

const ROOT_NODE_ID = MOCK_CURRENT_DATASET_NODE.id;

export const MOCK_GRAPH_WITH_SOURCES: LineageGraph = {
    nodes: [...MOCK_SOURCE_NODES, MOCK_CURRENT_DATASET_NODE],
    links: MOCK_SOURCE_NODES.map((node: LineageGraphNode): Edge => ({
        id: `${node.id}__and__${ROOT_NODE_ID}`,
        source: node.id,
        target: ROOT_NODE_ID,
    })),
};
