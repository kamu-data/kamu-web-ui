import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { DatasetKind, DatasetLineageBasicsFragment, FetchStepUrl } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { LineageUpdate } from "../../dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { LineageGraphNodeKind, LineageGraphNodeData, LineageNodeAccess } from "./lineage-model";

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
    public currentDataset: DatasetLineageBasicsFragment;

    constructor(private datasetSubsService: DatasetSubscriptionsService, private cdr: ChangeDetectorRef) {
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
            this.datasetSubsService.onLineageDataChanges.subscribe((lineageUpdate: LineageUpdate) => {
                this.updateGraph(lineageUpdate);
                this.cdr.markForCheck();
            }),
        );
    }

    private updateGraph(lineageUpdate: LineageUpdate): void {
        const edges = lineageUpdate.edges;
        this.currentDataset = lineageUpdate.origin;
        this.initLineageGraphProperty();
        this.isAvailableLineageGraph = edges.length !== 0;
        const uniqueDatasets: Record<string, DatasetLineageBasicsFragment> = {};
        edges.forEach((edge: DatasetLineageBasicsFragment[]) =>
            edge.forEach((dataset: DatasetLineageBasicsFragment) => {
                uniqueDatasets[dataset.id] = dataset;
            }),
        );
        this.addSourceGraphNodes(Object.values(uniqueDatasets));
        this.addDatasetGraphNodes(Object.values(uniqueDatasets), edges, this.currentDataset);
    }

    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

    private getDomainFromUrl(url: string): string {
        return new URL(url).hostname;
    }

    private addSourceGraphNodes(data: DatasetLineageBasicsFragment[]): void {
        const extraNodes = data.filter(
            (item: DatasetLineageBasicsFragment) =>
                item.kind === DatasetKind.Root && item.metadata.currentSource?.fetch.__typename === "FetchStepUrl",
        );

        const uniqueSourceNodesMap = new Map<string, Node>();
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
        data: DatasetLineageBasicsFragment[],
        edges: DatasetLineageBasicsFragment[][],
        currentDataset: DatasetLineageBasicsFragment,
    ): void {
        data.forEach((dataset: DatasetLineageBasicsFragment) => {
            this.lineageGraphNodes.push({
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

        edges.forEach((edge: DatasetLineageBasicsFragment[]) => {
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
