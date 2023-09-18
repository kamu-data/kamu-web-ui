import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { DatasetKind, FetchStepUrl } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import {
    DatasetLineageBasics,
    LineageGraphNodeData,
    LineageGraphNodeType,
    LineageUpdate,
} from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Input() public lineageGraphView: [number, number];
    @Output() onClickNodeEmit = new EventEmitter<Node>();

    public lineageGraphLink: Edge[] = [];
    public lineageGraphNodes: Node[] = [];
    public isAvailableLineageGraph = false;

    constructor(private appDatasetSubsService: AppDatasetSubscriptionsService, private cdr: ChangeDetectorRef) {
        super();
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }

    private initLineageGraphProperty(): void {
        this.lineageGraphNodes = [];
        this.lineageGraphLink = [];
    }

    public ngOnInit(): void {
        this.initLineageGraphProperty();
        this.trackSubscriptions(
            this.appDatasetSubsService.onLineageDataChanges.subscribe((lineageUpdate: LineageUpdate) => {
                this.updateGraph(lineageUpdate);
                this.cdr.markForCheck();
            }),
        );
    }

    private updateGraph(lineageUpdate: LineageUpdate): void {
        const edges = lineageUpdate.edges;
        const currentDataset = lineageUpdate.origin;
        this.initLineageGraphProperty();
        this.isAvailableLineageGraph = edges.length !== 0;
        const uniqueDatasets: Record<string, DatasetLineageBasics> = {};
        edges.forEach((edge: DatasetLineageBasics[]) =>
            edge.forEach((dataset: DatasetLineageBasics) => {
                uniqueDatasets[dataset.id] = dataset;
            }),
        );
        this.addSourceGraphNodes(Object.values(uniqueDatasets));
        this.addDatasetGraphNodes(Object.values(uniqueDatasets), edges, currentDataset);
    }

    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

    private getDomainFromUrl(url: string): string {
        return new URL(url).hostname;
    }

    private addSourceGraphNodes(data: DatasetLineageBasics[]): void {
        const extraNodes = data.filter(
            (item: DatasetLineageBasics) =>
                item.kind === DatasetKind.Root && item.metadata.currentSource?.fetch.__typename === "FetchStepUrl",
        );
        const uniqueSourceNodesMap = new Map<string, Node>();
        extraNodes.forEach((node: DatasetLineageBasics) => {
            const id = this.sanitizeID(node.id);
            const label = this.getDomainFromUrl((node.metadata.currentSource?.fetch as FetchStepUrl).url);

            if (!uniqueSourceNodesMap.has(label)) {
                uniqueSourceNodesMap.set(label, {
                    id: `extra-node-${id}`,
                    label,
                    data: {
                        nodeKind: LineageGraphNodeType.Source,
                        nodeDataObject: {},
                    } as LineageGraphNodeData,
                });
            }
            const extraNodeId = uniqueSourceNodesMap.has(label)
                ? uniqueSourceNodesMap.get(label)?.id
                : `extra-node-${id}`;
            if (extraNodeId) {
                this.lineageGraphLink.push({
                    id: `${extraNodeId}__and__${id}`,
                    source: extraNodeId,
                    target: id,
                });
            }
        });
        this.lineageGraphNodes = this.lineageGraphNodes.concat([...uniqueSourceNodesMap.values()]);
    }

    private addDatasetGraphNodes(
        data: DatasetLineageBasics[],
        edges: DatasetLineageBasics[][],
        currentDataset: DatasetLineageBasics,
    ): void {
        data.forEach((dataset: DatasetLineageBasics) => {
            this.lineageGraphNodes.push({
                id: this.sanitizeID(dataset.id),
                label: dataset.name,
                data: {
                    nodeKind: LineageGraphNodeType.Dataset,
                    nodeDataObject: {
                        id: dataset.id,
                        name: dataset.name,
                        kind: dataset.kind,
                        isRoot: dataset.kind === DatasetKind.Root,
                        isCurrent: dataset.id === currentDataset.id,
                        access: "private",
                        accountName: dataset.owner.name,
                    },
                } as LineageGraphNodeData,
            });
        });
        edges.forEach((edge: DatasetLineageBasics[]) => {
            const source: string = this.sanitizeID(edge[0].id);
            const target: string = this.sanitizeID(edge[1].id);
            this.lineageGraphLink.push({
                id: `${source}__and__${target}`,
                source,
                target,
            });
        });
    }
}
