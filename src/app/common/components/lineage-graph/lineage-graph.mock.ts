/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Edge, Node } from "@swimlane/ngx-graph";

import { MOCK_NODES } from "@api/mock/dataset.mock";

import {
    LineageGraph,
    LineageGraphNodeData,
    LineageGraphNodeKind,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

function mockSourceNode(kind: LineageGraphNodeKind, label: string): Node {
    return {
        id: `source-node-${kind}`,
        label,
        data: { kind, dataObject: {} } as LineageGraphNodeData,
    };
}

export const MOCK_SOURCE_NODES: Node[] = [
    mockSourceNode(LineageGraphNodeKind.Source, "example.com"),
    mockSourceNode(LineageGraphNodeKind.Mqtt, "test.mosquitto.org:1883"),
    mockSourceNode(LineageGraphNodeKind.EthereumLogs, "mainnet"),
    mockSourceNode(LineageGraphNodeKind.PushSource, "default"),
];

const ROOT_NODE_ID = MOCK_NODES[0].id;

export const MOCK_GRAPH_WITH_SOURCES: LineageGraph = {
    nodes: [...MOCK_SOURCE_NODES, MOCK_NODES[0]],
    links: MOCK_SOURCE_NODES.map((node: Node): Edge => ({
        id: `${node.id}__and__${ROOT_NODE_ID}`,
        source: node.id,
        target: ROOT_NODE_ID,
    })),
};
