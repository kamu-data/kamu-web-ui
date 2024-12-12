import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { DatasetLineageBasicsFragment, DatasetKind, FetchStep } from "src/app/api/kamu.graphql.interface";
import { LineageUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    LineageGraphNodeKind,
    LineageGraphNodeData,
    LineageNodeAccess,
    LineageGraph,
    LineageGraphUpdate,
} from "../lineage-graph.model";
import { Node, Edge } from "@swimlane/ngx-graph";
import _ from "lodash";
import { MaybeNull } from "src/app/common/app.types";

@Injectable({
    providedIn: "root",
})
export class LineageGraphBuilderService {
    private datasetSubsService = inject(DatasetSubscriptionsService);

    public buildGraph(): Observable<MaybeNull<LineageGraphUpdate>> {
        return this.datasetSubsService.lineageChanges.pipe(
            map((lineageUpdate: MaybeNull<LineageUpdate>) => {
                if (lineageUpdate) {
                    const uniqueDatasets: DatasetLineageBasicsFragment[] = this.collectUniqueDatasets(lineageUpdate);

                    const datasetSubgraph: LineageGraph = this.buildDatasetSubgraph(lineageUpdate, uniqueDatasets);
                    const sourceSubgraph: LineageGraph = this.buildSourceSubgraph(uniqueDatasets);

                    const graph: LineageGraph = {
                        nodes: [...sourceSubgraph.nodes, ...datasetSubgraph.nodes],
                        links: [...sourceSubgraph.links, ...datasetSubgraph.links],
                    };
                    return {
                        graph,
                        originDataset: lineageUpdate.origin,
                    } as LineageGraphUpdate;
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
        } as LineageGraph;
    }

    private buildDatasetGraphNodes(
        uniqueDatasets: DatasetLineageBasicsFragment[],
        currentDataset: DatasetLineageBasicsFragment,
    ): Node[] {
        return uniqueDatasets.map((dataset: DatasetLineageBasicsFragment) => {
            return {
                id: this.sanitizeID(dataset.id),
                label: dataset.name,
                data: {
                    kind: LineageGraphNodeKind.Dataset,
                    dataObject: {
                        id: dataset.id,
                        name: dataset.name,
                        kind: dataset.kind,
                        isCurrent: dataset.id === currentDataset.id,
                        access: LineageNodeAccess.PRIVATE,
                        accountName: dataset.owner.accountName,
                        avatarUrl: dataset.owner.avatarUrl,
                    },
                } as LineageGraphNodeData,
            } as Node;
        });
    }

    private buildDatasetEdges(lineageUpdate: LineageUpdate): Edge[] {
        return lineageUpdate.edges.map((edge: DatasetLineageBasicsFragment[]) => {
            const source: string = this.sanitizeID(edge[0].id);
            const target: string = this.sanitizeID(edge[1].id);
            return {
                id: `${source}__and__${target}`,
                source,
                target,
            } as Edge;
        });
    }

    private buildSourceSubgraph(uniqueDatasets: DatasetLineageBasicsFragment[]): LineageGraph {
        const source2DatasetLinks: Edge[] = [];
        const sourceNodesByLabel = new Map<string, Node>();

        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepUrl");
        this.buildSourceNodesByType(uniqueDatasets, sourceNodesByLabel, source2DatasetLinks, "FetchStepMqtt");

        return { nodes: [...sourceNodesByLabel.values()], links: source2DatasetLinks };
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
                sourceNodeLabel = this.buildSourceNodeLabel(dataset.metadata.currentPollingSource?.fetch as FetchStep);

                let sourceNode: Node | undefined = sourceNodesByLabel.get(sourceNodeLabel);
                if (_.isNil(sourceNode)) {
                    sourceNode = {
                        id: `source-node-${datasetId}`,
                        label: sourceNodeLabel,
                        data: {
                            kind: this.graphNodeKindMapper[kind],
                            dataObject: {},
                        } as LineageGraphNodeData,
                    } as Node;
                    sourceNodesByLabel.set(sourceNodeLabel, sourceNode);
                }

                source2DatasetLinks.push({
                    id: `${sourceNode.id}__and__${datasetId}`,
                    source: sourceNode.id,
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
    };

    private buildSourceNodeLabel(step: FetchStep): string {
        switch (step.__typename) {
            case "FetchStepUrl":
                return this.getDomainFromUrl(step.url);
            case "FetchStepMqtt":
                return `${step.host}:${step.port}`;
            default:
                throw new Error(`Unknown source label type ${step.__typename}`);
        }
    }
}
