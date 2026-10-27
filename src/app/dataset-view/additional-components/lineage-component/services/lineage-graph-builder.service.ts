/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, switchMap } from "rxjs";

import { Edge } from "@swimlane/ngx-graph";

import { LineageNodeSizeService } from "@common/components/lineage-graph/lineage-node-size.service";
import { requireValue } from "@common/helpers/app.helpers";
import { chainNameFromId } from "@common/helpers/ethereum.helpers";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import { DatasetKind, DatasetLineageBasicsFragment, FetchStepDataFragment } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DatasetLineageEntry } from "@interface/dataset.interface";

import {
    LineageGraph,
    LineageGraphNode,
    LineageGraphNodeKind,
    LineageGraphSourceNodeKind,
    LineageGraphUpdate,
    LineageNodeAccess,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { LineageUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Injectable({
    providedIn: "root",
})
export class LineageGraphBuilderService {
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private nodeSizeService = inject(LineageNodeSizeService);
    private displayDatasetIdPipe = new DisplayDatasetIdPipe();

    public buildGraph(): Observable<MaybeNull<LineageGraphUpdate>> {
        return this.nodeSizeService.whenFontsReady().pipe(
            switchMap(() => this.datasetSubsService.lineageChanges),
            map((lineageUpdate: MaybeNull<LineageUpdate>) => {
                if (lineageUpdate) {
                    const uniqueDatasets: DatasetLineageEntry[] = this.collectUniqueDatasets(lineageUpdate);
                    const accessibleDatasets: DatasetLineageBasicsFragment[] = uniqueDatasets.filter(
                        (dataset: DatasetLineageEntry): dataset is DatasetLineageBasicsFragment =>
                            dataset.__typename === "Dataset",
                    );

                    const datasetSubgraph: LineageGraph = this.buildDatasetSubgraph(lineageUpdate, uniqueDatasets);
                    const sourceSubgraph: LineageGraph = this.buildSourceSubgraph(accessibleDatasets);

                    const graph: LineageGraph = {
                        nodes: [...sourceSubgraph.nodes, ...datasetSubgraph.nodes],
                        links: [...sourceSubgraph.links, ...datasetSubgraph.links],
                    };

                    // Workaround for ngx-graph: the 'dagre' layout crashes if the graph contains nodes but 0 links.
                    // Adding a hidden self-loop edge prevents the "Cannot read properties of undefined (reading 'nodes')" error.
                    const { nodes, links } = graph;
                    if (nodes.length === 1 && links.length === 0) {
                        const singleNodeId = graph.nodes[0].id;
                        graph.links.push({
                            id: `hidden-loop-link-${singleNodeId}`,
                            source: singleNodeId,
                            target: singleNodeId,
                            data: { isHidden: true },
                        });
                    }

                    return {
                        graph,
                        originDataset: lineageUpdate.origin,
                    };
                } else {
                    return null;
                }
            }),
        );
    }

    private collectUniqueDatasets(lineageUpdate: LineageUpdate): DatasetLineageEntry[] {
        const datasetsById: Map<string, DatasetLineageEntry> = new Map<string, DatasetLineageEntry>();
        // Added one unique dataset, if lineage has only ROOT dataset
        if (lineageUpdate.nodes.length === 1 && lineageUpdate.origin.kind === DatasetKind.Root) {
            datasetsById.set(lineageUpdate.origin.id, lineageUpdate.origin);
        }
        lineageUpdate.edges.forEach((edge: DatasetLineageEntry[]) =>
            edge.forEach((dataset: DatasetLineageEntry) => {
                datasetsById.set(dataset.id, dataset);
            }),
        );
        return [...datasetsById.values()];
    }

    private buildDatasetSubgraph(lineageUpdate: LineageUpdate, uniqueDatasets: DatasetLineageEntry[]): LineageGraph {
        return {
            nodes: this.buildDatasetGraphNodes(uniqueDatasets, lineageUpdate.origin),
            links: this.buildDatasetEdges(lineageUpdate),
        };
    }

    private buildDatasetGraphNodes(
        uniqueDatasets: DatasetLineageEntry[],
        currentDataset: DatasetLineageBasicsFragment,
    ): LineageGraphNode[] {
        return uniqueDatasets.map((dataset: DatasetLineageEntry): LineageGraphNode => {
            if (dataset.__typename === "Dataset") {
                return {
                    id: this.sanitizeID(dataset.id),
                    label: dataset.name,
                    dimension: this.nodeSizeService.datasetNodeSize(dataset.name, dataset.owner.accountName),
                    data: {
                        kind: LineageGraphNodeKind.Dataset,
                        dataObject: {
                            id: dataset.id,
                            name: dataset.name,
                            kind: dataset.kind,
                            isCurrent: dataset.id === currentDataset.id,
                            access:
                                dataset.visibility.__typename === "PrivateDatasetVisibility"
                                    ? LineageNodeAccess.PRIVATE
                                    : LineageNodeAccess.PUBLIC,
                            accountName: dataset.owner.accountName,
                            avatarUrl: dataset.owner.avatarUrl,
                        },
                    },
                };
            } else {
                const id = dataset.id;
                return {
                    id: this.sanitizeID(id),
                    label: id,
                    dimension: this.nodeSizeService.inaccessibleNodeSize(this.displayDatasetIdPipe.transform(id)),
                    data: {
                        kind: LineageGraphNodeKind.DatasetNotAccessable,
                    },
                };
            }
        });
    }

    private buildDatasetEdges(lineageUpdate: LineageUpdate): Edge[] {
        return lineageUpdate.edges.map((edge) => {
            const source: string = this.sanitizeID(edge[0].id);
            const target: string = this.sanitizeID(edge[1].id);
            return {
                id: `${source}__and__${target}`,
                source,
                target,
            };
        });
    }

    private buildSourceSubgraph(uniqueDatasets: DatasetLineageBasicsFragment[]): LineageGraph {
        const source2DatasetLinks: Edge[] = [];
        const sourceNodesByLabel = new Map<string, LineageGraphNode>();

        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepUrl");
        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepMqtt");
        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepEthereumLogs");

        this.buildPushSourceNodes(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "AddPushSource");

        return { nodes: [...sourceNodesByLabel.values()], links: source2DatasetLinks };
    }

    private buildPushSourceNodes(
        uniqueDatasets: DatasetLineageBasicsFragment[],
        sourceNodesByLabel: Map<string, LineageGraphNode>,
        source2DatasetLinks: Edge[],
        kind: string,
    ): void {
        let sourceNodeLabel: string;
        const qualifyingDatasetsPushSource = uniqueDatasets.filter(
            (dataset: DatasetLineageBasicsFragment) =>
                dataset.kind === DatasetKind.Root && dataset.metadata.currentPushSources.length,
        );

        if (qualifyingDatasetsPushSource.length) {
            qualifyingDatasetsPushSource.forEach((dataset: DatasetLineageBasicsFragment) => {
                dataset.metadata.currentPushSources.forEach((pushSource: { sourceName: string }) => {
                    const datasetId = this.sanitizeID(dataset.id);
                    sourceNodeLabel = pushSource.sourceName;

                    let sourceNode: MaybeUndefined<LineageGraphNode> = sourceNodesByLabel.get(sourceNodeLabel);
                    if (sourceNode === undefined) {
                        sourceNode = {
                            id: `source-node-${sourceNodeLabel}`,
                            label: sourceNodeLabel,
                            dimension: this.nodeSizeService.sourceNodeSize(
                                this.graphNodeKindMapper[kind],
                                sourceNodeLabel,
                            ),
                            data: { kind: this.graphNodeKindMapper[kind] },
                        };
                        sourceNodesByLabel.set(sourceNodeLabel, sourceNode);
                    }

                    source2DatasetLinks.push({
                        id: `${sourceNode.id}__and__${datasetId}`,
                        source: sourceNode.id,
                        target: datasetId,
                    });
                });
            });
        }
    }

    private buildSourceNodesByType(
        uniqueDatasets: DatasetLineageBasicsFragment[],
        sourceNodesByLabel: Map<string, LineageGraphNode>,
        source2DatasetLinks: Edge[],
        kind: string,
    ): void {
        let sourceNodeLabel: string;
        const qualifyingDatasetsUrl = uniqueDatasets.filter(
            (dataset: DatasetLineageBasicsFragment) =>
                dataset.kind === DatasetKind.Root && dataset.metadata.currentPollingSource?.fetch.__typename === kind,
        );

        if (qualifyingDatasetsUrl.length) {
            qualifyingDatasetsUrl.forEach((dataset: DatasetLineageBasicsFragment) => {
                const datasetId = this.sanitizeID(dataset.id);
                sourceNodeLabel = this.buildSourceNodeLabel(
                    requireValue(dataset.metadata.currentPollingSource?.fetch ?? null),
                );

                let sourceNode: MaybeUndefined<LineageGraphNode> = sourceNodesByLabel.get(sourceNodeLabel);
                if (sourceNode === undefined) {
                    sourceNode = {
                        id: `source-node-${datasetId}`,
                        label: sourceNodeLabel,
                        dimension: this.nodeSizeService.sourceNodeSize(this.graphNodeKindMapper[kind], sourceNodeLabel),
                        data: { kind: this.graphNodeKindMapper[kind] },
                    };
                    sourceNodesByLabel.set(sourceNodeLabel, sourceNode);
                }

                source2DatasetLinks.push({
                    id: `${sourceNode.id}__and__${datasetId}`,
                    source: sourceNode.id,
                    target: datasetId,
                });
            });
        }
    }

    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

    private getDomainFromUrl(url: string): string {
        return new URL(url).hostname;
    }

    private graphNodeKindMapper: Record<string, LineageGraphSourceNodeKind> = {
        FetchStepUrl: LineageGraphNodeKind.Source,
        FetchStepMqtt: LineageGraphNodeKind.Mqtt,
        FetchStepEthereumLogs: LineageGraphNodeKind.EthereumLogs,
        AddPushSource: LineageGraphNodeKind.PushSource,
    };

    private buildSourceNodeLabel(step: FetchStepDataFragment): string {
        switch (step.__typename) {
            case "FetchStepUrl":
                return this.getDomainFromUrl(step.url);
            case "FetchStepMqtt":
                return `${step.host}:${step.port}`;
            case "FetchStepEthereumLogs":
                return step.nodeUrl ? step.nodeUrl : chainNameFromId(Number(step.chainId));
            default:
                throw new Error(`Unknown source label type ${step.__typename}`);
        }
    }
}
