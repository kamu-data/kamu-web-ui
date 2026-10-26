/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, switchMap } from "rxjs";

import { Edge, Node } from "@swimlane/ngx-graph";

import { LineageNodeSizeService } from "@common/components/lineage-graph/lineage-node-size.service";
import { isNil, requireValue } from "@common/helpers/app.helpers";
import { chainNameFromId } from "@common/helpers/ethereum.helpers";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import {
    DatasetAccessResultNotAccessibleDataFragment,
    DatasetKind,
    DatasetLineageBasicsFragment,
    FetchStepDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import {
    LineageGraph,
    LineageGraphNodeData,
    LineageGraphNodeKind,
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
                    const uniqueDatasets: DatasetLineageBasicsFragment[] = this.collectUniqueDatasets(lineageUpdate);

                    const datasetSubgraph: LineageGraph = this.buildDatasetSubgraph(lineageUpdate, uniqueDatasets);
                    const sourceSubgraph: LineageGraph = this.buildSourceSubgraph(uniqueDatasets);

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

    private collectUniqueDatasets(lineageUpdate: LineageUpdate): DatasetLineageBasicsFragment[] {
        const datasetsById: Map<string, DatasetLineageBasicsFragment> = new Map<string, DatasetLineageBasicsFragment>();
        // Added one unique dataset, if lineage has only ROOT dataset
        if (lineageUpdate.nodes.length === 1 && lineageUpdate.origin.kind === DatasetKind.Root) {
            datasetsById.set(lineageUpdate.origin.id, lineageUpdate.origin);
        }
        lineageUpdate.edges.forEach((edge: DatasetLineageBasicsFragment[]) =>
            edge.forEach((dataset: DatasetLineageBasicsFragment) => {
                datasetsById.set(dataset.id, dataset);
            }),
        );
        return [...datasetsById.values()];
    }

    private buildDatasetSubgraph(
        lineageUpdate: LineageUpdate,
        uniqueDatasets: DatasetLineageBasicsFragment[],
    ): LineageGraph {
        return {
            nodes: this.buildDatasetGraphNodes(uniqueDatasets, lineageUpdate.origin),
            links: this.buildDatasetEdges(lineageUpdate),
        };
    }

    private buildDatasetGraphNodes(
        uniqueDatasets: (DatasetLineageBasicsFragment | DatasetAccessResultNotAccessibleDataFragment)[],
        currentDataset: DatasetLineageBasicsFragment,
    ): Node[] {
        return uniqueDatasets.map((dataset) => {
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
                    } as LineageGraphNodeData,
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
        const sourceNodesByLabel = new Map<string, Node>();

        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepUrl");
        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepMqtt");
        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepEthereumLogs");

        this.buildPushSourceNodes(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "AddPushSource");

        return { nodes: [...sourceNodesByLabel.values()], links: source2DatasetLinks };
    }

    private buildPushSourceNodes(
        uniqueDatasets: DatasetLineageBasicsFragment[],
        sourceNodesByLabel: Map<string, Node>,
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

                    let sourceNode: MaybeUndefined<Node> = sourceNodesByLabel.get(sourceNodeLabel);
                    if (isNil(sourceNode)) {
                        sourceNode = {
                            id: `source-node-${sourceNodeLabel}`,
                            label: sourceNodeLabel,
                            dimension: this.nodeSizeService.sourceNodeSize(
                                this.graphNodeKindMapper[kind],
                                sourceNodeLabel,
                            ),
                            data: {
                                kind: this.graphNodeKindMapper[kind],
                                dataObject: {},
                            } as LineageGraphNodeData,
                        };
                        sourceNodesByLabel.set(sourceNodeLabel, sourceNode);
                    }

                    source2DatasetLinks.push({
                        id: `${sourceNode?.id}__and__${datasetId}`,
                        source: sourceNode?.id,
                        target: datasetId,
                    } as Edge);
                });
            });
        }
    }

    private buildSourceNodesByType(
        uniqueDatasets: DatasetLineageBasicsFragment[],
        sourceNodesByLabel: Map<string, Node>,
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

                let sourceNode: MaybeUndefined<Node> = sourceNodesByLabel.get(sourceNodeLabel);
                if (isNil(sourceNode)) {
                    sourceNode = {
                        id: `source-node-${datasetId}`,
                        label: sourceNodeLabel,
                        dimension: this.nodeSizeService.sourceNodeSize(this.graphNodeKindMapper[kind], sourceNodeLabel),
                        data: {
                            kind: this.graphNodeKindMapper[kind],
                            dataObject: {},
                        } as LineageGraphNodeData,
                    };
                    sourceNodesByLabel.set(sourceNodeLabel, sourceNode);
                }

                source2DatasetLinks.push({
                    id: `${sourceNode?.id}__and__${datasetId}`,
                    source: sourceNode?.id,
                    target: datasetId,
                } as Edge);
            });
        }
    }

    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

    private getDomainFromUrl(url: string): string {
        return new URL(url).hostname;
    }

    private graphNodeKindMapper: Record<string, LineageGraphNodeKind> = {
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
                // The API sends Uint64 as a string, although codegen types it as a number
                return step.nodeUrl ? step.nodeUrl : chainNameFromId(Number(step.chainId));
            default:
                throw new Error(`Unknown source label type ${step.__typename}`);
        }
    }
}
