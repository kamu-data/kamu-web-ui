import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
} from "@angular/core";
import { Edge, MiniMapPosition } from "@swimlane/ngx-graph";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageGraphComponent implements OnChanges, OnInit {
    @Input() public view: [number, number];
    @Input() public links: Edge[];
    @Input() public nodes: Node[];
    @Input() public clusters: ClusterNode[];

    @Output() public onClickNodeEvent = new EventEmitter<Node>();

    public draggingEnabled = false;
    public panningEnabled = true;
    public zoomEnabled = true;
    public zoomSpeed = 0.03;
    public minZoomLevel = 0.1;
    public maxZoomLevel = 4.0;
    public panOnZoom = true;
    public autoZoom = true;
    public autoCenter = true;
    public showMiniMap = true;
    public miniMapPosition: MiniMapPosition;
    public graphClusters: ClusterNode[];
    public graphNodes: Node[];

    public ngOnInit(): void {
        this.graphNodes = this.nodes;
        this.graphClusters = this.clusters;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const clusters: SimpleChange = changes.clusters;
        const nodes: SimpleChange = changes.nodes;
        if (clusters.currentValue && clusters.currentValue !== clusters.previousValue) {
            const currentClusters = clusters.currentValue as ClusterNode[];
            this.graphClusters = currentClusters.filter(
                (cluster: ClusterNode) => cluster.childNodeIds && cluster.childNodeIds.length !== 0,
            );
        }
        if (nodes.currentValue && nodes.currentValue !== nodes.previousValue) {
            this.graphNodes = nodes.currentValue as Node[];
        }
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEvent.emit(node);
    }
}
