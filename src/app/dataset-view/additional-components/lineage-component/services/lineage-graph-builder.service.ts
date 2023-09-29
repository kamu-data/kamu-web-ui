import { Injectable } from "@angular/core";
import { Observable, Subject, combineLatest, map, of, switchMap } from "rxjs";
import { DatasetLineageBasicsFragment, DatasetKind, FetchStepUrl } from "src/app/api/kamu.graphql.interface";
import { LineageUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { LineageGraphNodeKind, LineageGraphNodeData, LineageNodeAccess, LineageGraph } from "../lineage-model";
import { Node, Edge } from "@swimlane/ngx-graph";
import { mockLineageGraphUpdate } from "../../data-tabs.mock";

@Injectable({
    providedIn: "root",
})
export class LineageGraphBuilderService {
    private lineageSourceLinkChanges: Subject<Edge[]> = new Subject<Edge[]>();

    private changeSourceLink(links: Edge[]): void {
        this.lineageSourceLinkChanges.next(links);
    }

    private onLineageSourceLinkChanges(): Observable<Edge[]> {
        return this.lineageSourceLinkChanges.asObservable();
    }

    constructor(private datasetSubsService: DatasetSubscriptionsService) {}

    public getCurrentDataset(): Observable<DatasetLineageBasicsFragment> {
        return this.datasetSubsService.onLineageDataChanges.pipe(map((data: LineageUpdate) => data.origin));
    }

    public buildGraph(): Observable<LineageGraph> {
        return combineLatest([this.buildGraphNodes(), this.buildGraphLinks()]).pipe(
            switchMap(([nodes, links]: [Node[], Edge[]]) => of({ nodes, links })),
        );
    }

    private buildGraphNodes(): Observable<Node[]> {
        return this.datasetSubsService.onLineageDataChanges.pipe(
            map((data: LineageUpdate) => {
                data = mockLineageGraphUpdate;
                const uniqueDatasets: Record<string, DatasetLineageBasicsFragment> = {};
                data.edges.forEach((edge: DatasetLineageBasicsFragment[]) =>
                    edge.forEach((dataset: DatasetLineageBasicsFragment) => {
                        uniqueDatasets[dataset.id] = dataset;
                    }),
                );
                const sourceNodes = this.addSourceGraphNodes(Object.values(uniqueDatasets));
                const datasetNodes = this.addDatasetGraphNodes(Object.values(uniqueDatasets), data.origin);
                return [...sourceNodes, ...datasetNodes];
            }),
        );
    }

    private buildGraphLinks(): Observable<Edge[]> {
        return combineLatest([
            this.onLineageSourceLinkChanges(),
            this.buildDatasetLinks(),
            this.buildGraphNodes(),
        ]).pipe(
            switchMap(([sourceLinks, datasetLinks]: [Edge[], Edge[], Node[]]) => of(sourceLinks.concat(datasetLinks))),
        );
    }

    private buildDatasetLinks(): Observable<Edge[]> {
        return this.datasetSubsService.onLineageDataChanges.pipe(
            map((data: LineageUpdate) => {
                data = mockLineageGraphUpdate;
                const lineageGraphLink: Edge[] = [];
                data.edges.forEach((edge: DatasetLineageBasicsFragment[]) => {
                    const source: string = this.sanitizeID(edge[0].id);
                    const target: string = this.sanitizeID(edge[1].id);
                    lineageGraphLink.push({
                        id: `${source}__and__${target}`,
                        source,
                        target,
                    });
                });
                return lineageGraphLink;
            }),
        );
    }

    private addDatasetGraphNodes(
        data: DatasetLineageBasicsFragment[],
        currentDataset: DatasetLineageBasicsFragment,
    ): Node[] {
        const lineageGraphNodes: Node[] = [];
        data.forEach((dataset: DatasetLineageBasicsFragment) => {
            lineageGraphNodes.push({
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
            });
        });
        return lineageGraphNodes;
    }

    private addSourceGraphNodes(data: DatasetLineageBasicsFragment[]): Node[] {
        const lineageGraphNodes: Node[] = [];
        const extraNodes = data.filter(
            (item: DatasetLineageBasicsFragment) =>
                item.kind === DatasetKind.Root && item.metadata.currentSource?.fetch.__typename === "FetchStepUrl",
        );
        const uniqueSourceNodesMap = new Map<string, Node>();
        const linkSourceNodes: Edge[] = [];
        extraNodes.forEach((node: DatasetLineageBasicsFragment) => {
            const id = this.sanitizeID(node.id);
            const label = this.getDomainFromUrl((node.metadata.currentSource?.fetch as FetchStepUrl).url);

            if (!uniqueSourceNodesMap.has(label)) {
                uniqueSourceNodesMap.set(label, {
                    id: `extra-node-${id}`,
                    label,
                    data: {
                        kind: LineageGraphNodeKind.Source,
                        dataObject: {},
                    } as LineageGraphNodeData,
                });
            }
            const extraNodeId = uniqueSourceNodesMap.has(label)
                ? uniqueSourceNodesMap.get(label)?.id
                : `extra-node-${id}`;
            if (extraNodeId) {
                linkSourceNodes.push({
                    id: `${extraNodeId}__and__${id}`,
                    source: extraNodeId,
                    target: id,
                });
            }
        });
        this.changeSourceLink(linkSourceNodes);
        return lineageGraphNodes.concat([...uniqueSourceNodesMap.values()]);
    }

    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

    private getDomainFromUrl(url: string): string {
        return new URL(url).hostname;
    }
}
