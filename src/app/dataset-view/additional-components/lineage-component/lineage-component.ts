import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { DatasetBasicsFragment, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { LineageUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage-component.html",
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Input() public lineageGraphView: [number, number];
    @Output() onClickNodeEmit = new EventEmitter<Node>();

    public lineageGraphLink: Edge[] = [];
    public lineageGraphNodes: Node[] = [];
    public lineageGraphClusters: ClusterNode[] = [];
    public isAvailableLineageGraph = false;

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
    ) {
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
        this.lineageGraphClusters = [
            {
                id: DatasetKind.Root + "_cluster",
                label: DatasetKind.Root,
                data: { customColor: "#A52A2A59" },
                position: { x: 10, y: 10 },
                childNodeIds: [],
            },
            {
                id: DatasetKind.Derivative + "_cluster",
                label: DatasetKind.Derivative,
                data: { customColor: "#00800039" },
                position: { x: 10, y: 10 },
                childNodeIds: [],
            },
        ];

        this.trackSubscriptions(
            this.appDatasetSubsService.onLineageDataChanges.subscribe(
                (lineageUpdate: LineageUpdate) => {
                    this.updateGraph(lineageUpdate);
                }
            )
        );
    }

    private updateGraph(lineageUpdate: LineageUpdate): void {
        lineageUpdate.nodes.forEach((dataset: DatasetBasicsFragment) => {
            this.lineageGraphClusters =
                this.lineageGraphClusters.map(
                    (cluster: ClusterNode) => {
                        if (
                            typeof cluster.childNodeIds ===
                            "undefined"
                        ) {
                            cluster.childNodeIds = [];
                        }

                        if (cluster.label === dataset.kind) {
                            cluster.childNodeIds.push(dataset.id as string);
                        }
                        return cluster;
                    },
                );
        });

        const edges = lineageUpdate.edges;
        const currentDataset = lineageUpdate.origin;

        this.initLineageGraphProperty();

        this.isAvailableLineageGraph = edges.length !== 0;

        const uniqueDatasets: Record<string, DatasetBasicsFragment> = {};
        edges.forEach((edge: DatasetBasicsFragment[]) =>
            edge.forEach((dataset: DatasetBasicsFragment) => {
                uniqueDatasets[dataset.id as string] = dataset;
            }),
        );

        for (const [id, dataset] of Object.entries(
            uniqueDatasets,
        )) {
            this.lineageGraphNodes.push({
                id: this.sanitizeID(id),
                label: dataset.name as string,
                data: {
                    id: dataset.id as string,
                    name: dataset.name as string,
                    kind: dataset.kind,
                    isRoot: dataset.kind === DatasetKind.Root,
                    isCurrent: dataset.id === currentDataset.id,
                },
            });
        }

        edges.forEach((edge: DatasetBasicsFragment[]) => {
            const source: string = this.sanitizeID(edge[0].id as string);
            const target: string = this.sanitizeID(edge[1].id as string);

            this.lineageGraphLink.push({
                id: `${source}__and__${target}`,
                source,
                target,
            });
        });        
    }

    // TODO: Use `String.replaceAll()`
    private sanitizeID(id: string): string {
        return id.replace(/:/g, "");
    }

}