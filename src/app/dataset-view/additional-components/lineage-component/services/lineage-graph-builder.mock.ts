/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetAccessResultNotAccessible,
    DatasetKind,
    DatasetLineageBasicsFragment,
    DatasetLineageMetadataDataFragment,
    FetchStepEthereumLogs,
} from "@api/kamu.graphql.interface";

import { mockGraphNode } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { LineageUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

function mockLineageDataset(
    id: string,
    name: string,
    kind: DatasetKind,
    metadata: Partial<DatasetLineageMetadataDataFragment> = {},
): DatasetLineageBasicsFragment {
    return {
        ...mockGraphNode,
        __typename: "Dataset",
        id,
        name,
        kind,
        alias: `${mockGraphNode.owner.accountName}/${name}`,
        metadata: {
            ...mockGraphNode.metadata,
            currentPollingSource: null,
            currentPushSources: [],
            ...metadata,
        },
    };
}

function mockEthereumRoot(id: string, name: string, fetch: FetchStepEthereumLogs): DatasetLineageBasicsFragment {
    return mockLineageDataset(id, name, DatasetKind.Root, {
        currentPollingSource: { __typename: "SetPollingSource", fetch },
    });
}

export const MOCK_DERIVED_DATASET = mockLineageDataset("did:odf:derived", "derived", DatasetKind.Derivative);

export const MOCK_SHARED_PUSH_SOURCE_NAME = "default";

const mockPushRootA = mockLineageDataset("did:odf:push-a", "push-a", DatasetKind.Root, {
    currentPushSources: [{ __typename: "AddPushSource", sourceName: MOCK_SHARED_PUSH_SOURCE_NAME }],
});
const mockPushRootB = mockLineageDataset("did:odf:push-b", "push-b", DatasetKind.Root, {
    currentPushSources: [{ __typename: "AddPushSource", sourceName: MOCK_SHARED_PUSH_SOURCE_NAME }],
});

export const mockLineageUpdateWithSharedPushSource: LineageUpdate = {
    nodes: [mockPushRootA, mockPushRootB, MOCK_DERIVED_DATASET],
    edges: [
        [mockPushRootA, MOCK_DERIVED_DATASET],
        [mockPushRootB, MOCK_DERIVED_DATASET],
    ],
    origin: MOCK_DERIVED_DATASET,
};

// The API sends Uint64 as a string, although codegen types it as a number
const MOCK_CHAIN_ID_FROM_API = "1" as unknown as number;

export const MOCK_ETHEREUM_NODE_URL = "https://eth.example.com";

const mockEthereumRootWithNodeUrl = mockEthereumRoot("did:odf:eth-node", "eth-node", {
    __typename: "FetchStepEthereumLogs",
    nodeUrl: MOCK_ETHEREUM_NODE_URL,
    chainId: MOCK_CHAIN_ID_FROM_API,
});
const mockEthereumRootWithChainOnly = mockEthereumRoot("did:odf:eth-chain", "eth-chain", {
    __typename: "FetchStepEthereumLogs",
    nodeUrl: null,
    chainId: MOCK_CHAIN_ID_FROM_API,
});

export const mockLineageUpdateWithEthereumSources: LineageUpdate = {
    nodes: [mockEthereumRootWithNodeUrl, mockEthereumRootWithChainOnly, MOCK_DERIVED_DATASET],
    edges: [
        [mockEthereumRootWithNodeUrl, MOCK_DERIVED_DATASET],
        [mockEthereumRootWithChainOnly, MOCK_DERIVED_DATASET],
    ],
    origin: MOCK_DERIVED_DATASET,
};

export const MOCK_INACCESSIBLE_DATASET: DatasetAccessResultNotAccessible = {
    __typename: "DatasetAccessResultNotAccessible",
    id: "did:odf:hidden",
    message: "Dataset is not accessible",
};

// DatasetService emits inaccessible datasets among the nodes and edges, although LineageUpdate does not type them
const mockInaccessibleLineageEntry = MOCK_INACCESSIBLE_DATASET as unknown as DatasetLineageBasicsFragment;

export const mockLineageUpdateWithInaccessibleDataset: LineageUpdate = {
    nodes: [MOCK_DERIVED_DATASET, mockInaccessibleLineageEntry],
    edges: [[mockInaccessibleLineageEntry, MOCK_DERIVED_DATASET]],
    origin: MOCK_DERIVED_DATASET,
};

export const mockLineageUpdateWithLoneDerivative: LineageUpdate = {
    nodes: [MOCK_DERIVED_DATASET],
    edges: [],
    origin: MOCK_DERIVED_DATASET,
};
