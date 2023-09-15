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
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
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
        const protocols = ["http", "https", "ftp"];
        return protocols.some((protocol) => url.includes(protocol)) ? new URL(url).hostname : url;
    }

    private addSourceGraphNodes(data: DatasetLineageBasics[]): void {
        const extraNodes = data.filter(
            (item: DatasetLineageBasics) =>
                item.kind === DatasetKind.Root && item.metadata.currentSource?.fetch.__typename === "FetchStepUrl",
        );
        extraNodes.forEach((node: DatasetLineageBasics) => {
            const id = this.sanitizeID(node.id);
            const label = this.getDomainFromUrl(
                node.metadata.currentSource?.fetch.__typename === "FetchStepUrl"
                    ? node.metadata.currentSource.fetch.url
                    : "Other source",
            );
            const indexExistingSource = this.lineageGraphNodes.findIndex((node) => node.label === label);
            if (indexExistingSource === -1) {
                this.lineageGraphNodes.push({
                    id: "extra-node-" + id,
                    label,
                    data: {
                        nodeKind: LineageGraphNodeType.Source,
                        nodeDataObject: {},
                    } as LineageGraphNodeData,
                });
            }
            const validId = indexExistingSource == -1 ? id : this.lineageGraphLink[indexExistingSource].target;
            this.lineageGraphLink.push({
                id: `extra-node-${validId}__and__${id}`,
                source: "extra-node-" + validId,
                target: id,
            });
        });
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
