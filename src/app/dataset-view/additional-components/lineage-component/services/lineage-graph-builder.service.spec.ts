/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom } from "rxjs";

import { Node } from "@swimlane/ngx-graph";

import { requireValue } from "@common/helpers/app.helpers";

import {
    mockBuildGraphNodesResult,
    mockLineageGraphUpdate,
    mockLineageGraphUpdateWithMqttSource,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import {
    LineageGraphNodeData,
    LineageGraphNodeKind,
    LineageGraphUpdate,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import {
    MOCK_DERIVED_DATASET,
    MOCK_ETHEREUM_NODE_URL,
    MOCK_INACCESSIBLE_DATASET,
    MOCK_SHARED_PUSH_SOURCE_NAME,
    mockLineageUpdateWithEthereumSources,
    mockLineageUpdateWithInaccessibleDataset,
    mockLineageUpdateWithSharedPushSource,
} from "src/app/dataset-view/additional-components/lineage-component/services/lineage-graph-builder.mock";
import { LineageGraphBuilderService } from "src/app/dataset-view/additional-components/lineage-component/services/lineage-graph-builder.service";
import { LineageUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

describe("LineageGraphBuilderService", () => {
    let service: LineageGraphBuilderService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageGraphBuilderService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
    });

    async function buildGraph(lineage: LineageUpdate): Promise<LineageGraphUpdate> {
        datasetSubsService.emitLineageChanged(lineage);
        const update = await firstValueFrom(service.buildGraph());
        expect(update).not.toBeNull();
        return requireValue(update);
    }

    function nodesOfKind(update: LineageGraphUpdate, kind: LineageGraphNodeKind): Node[] {
        return update.graph.nodes.filter((node: Node) => (node.data as LineageGraphNodeData).kind === kind);
    }

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check null on the input results in null on the output", async () => {
        datasetSubsService.emitLineageChanged(null);
        const update = await firstValueFrom(service.buildGraph());
        expect(update).toBeNull();
    });

    it("should check get current dataset", async () => {
        const update = await buildGraph(mockLineageGraphUpdate);
        expect(update.originDataset).toEqual(mockLineageGraphUpdate.origin);
    });

    it("should check build graph", async () => {
        const update = await buildGraph(mockLineageGraphUpdate);
        expect(update.graph.links.length).toEqual(4);
        expect(update.graph.nodes.length).toEqual(5);
    });

    it("should check source nodes length with URL", async () => {
        const update = await buildGraph(mockLineageGraphUpdate);
        const dataSourceUrl = mockLineageGraphUpdate.nodes.filter(
            (node) => node.metadata.currentPollingSource?.fetch.__typename === "FetchStepUrl",
        );
        expect(nodesOfKind(update, LineageGraphNodeKind.Source).length).toEqual(dataSourceUrl.length);
    });

    it("should check source nodes length with MQTT", async () => {
        const update = await buildGraph(mockLineageGraphUpdateWithMqttSource);
        const dataSourceMqtt = mockLineageGraphUpdateWithMqttSource.nodes.filter(
            (node) => node.metadata.currentPollingSource?.fetch.__typename === "FetchStepMqtt",
        );
        expect(nodesOfKind(update, LineageGraphNodeKind.Mqtt).length).toEqual(dataSourceMqtt.length);
    });

    it("should check nodes were built correctly", async () => {
        const update = await buildGraph(mockLineageGraphUpdate);
        expect(update.graph.nodes).toEqual(mockBuildGraphNodesResult);
    });

    it("should give a lone dataset a hidden self-loop, so that the layout does not crash", async () => {
        const datasetWithoutSource = {
            ...mockLineageGraphUpdateWithMqttSource.origin,
            metadata: { ...mockLineageGraphUpdateWithMqttSource.origin.metadata, currentPollingSource: null },
        };
        const update = await buildGraph({
            nodes: [datasetWithoutSource],
            edges: [],
            origin: datasetWithoutSource,
        });

        expect(update.graph.nodes.length).toEqual(1);
        const nodeId = update.graph.nodes[0].id;
        expect(update.graph.links).toEqual([
            { id: `hidden-loop-link-${nodeId}`, source: nodeId, target: nodeId, data: { isHidden: true } },
        ]);
    });

    it("should build a node and an edge for an inaccessible dataset", async () => {
        const update = await buildGraph(mockLineageUpdateWithInaccessibleDataset);

        const inaccessibleId = MOCK_INACCESSIBLE_DATASET.id.replace(/:/g, "");
        const derivedId = MOCK_DERIVED_DATASET.id.replace(/:/g, "");
        expect(nodesOfKind(update, LineageGraphNodeKind.DatasetNotAccessable)).toEqual([
            {
                id: inaccessibleId,
                label: MOCK_INACCESSIBLE_DATASET.id,
                data: { kind: LineageGraphNodeKind.DatasetNotAccessable },
            } as Node,
        ]);
        expect(update.graph.links).toEqual([
            { id: `${inaccessibleId}__and__${derivedId}`, source: inaccessibleId, target: derivedId },
        ]);
    });

    it("should share one push source node between datasets, with an edge of its own to each", async () => {
        const update = await buildGraph(mockLineageUpdateWithSharedPushSource);

        const pushSourceNodes = nodesOfKind(update, LineageGraphNodeKind.PushSource);
        expect(pushSourceNodes.map((node: Node) => node.label)).toEqual([MOCK_SHARED_PUSH_SOURCE_NAME]);

        const pushSourceLinks = update.graph.links.filter((link) => link.source === pushSourceNodes[0].id);
        expect(pushSourceLinks.map((link) => link.target)).toEqual(["didodfpush-a", "didodfpush-b"]);
        expect(new Set(pushSourceLinks.map((link) => link.id)).size).toEqual(pushSourceLinks.length);
    });

    it("should label an Ethereum source by its node URL, otherwise by its chain name", async () => {
        const update = await buildGraph(mockLineageUpdateWithEthereumSources);

        const labels = nodesOfKind(update, LineageGraphNodeKind.EthereumLogs).map((node: Node) => node.label);
        expect(labels).toEqual([MOCK_ETHEREUM_NODE_URL, "mainnet"]);
    });
});
