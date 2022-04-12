import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
} from "@angular/core";
import { Edge } from "@swimlane/ngx-graph";
import { ClusterNode } from "@swimlane/ngx-graph/lib/models/node.model";

@Component({
    selector: "app-linage-graph",
    templateUrl: "./linage-graph.component.html",
})
export class LinageGraphComponent implements OnChanges, OnInit {
    @Input() public view: [number, number];
    @Input() public links: any[];
    @Input() public nodes: any[];
    @Input() public clusters: any[];

    @Output() public onClickNodeEvent: EventEmitter<string> =
        new EventEmitter();

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
    public miniMapPosition: any;
    public graphClusters: any[];
    public graphNodes: any[];

    public ngOnInit(): void {
        this.graphNodes = this.nodes || [];
        this.graphClusters = this.graphClusters || [];
    }
    public ngOnChanges(changes: SimpleChanges): void {
        const clusters: SimpleChange = changes.clusters;
        const nodes: SimpleChange = changes.nodes;
        if (clusters) {
            if (
                typeof clusters.currentValue !== "undefined" &&
                clusters.currentValue !== clusters.previousValue
            ) {
                if (typeof clusters.currentValue !== "undefined") {
                    this.graphClusters = clusters.currentValue.filter(
                        (cluster: ClusterNode) =>
                            cluster.childNodeIds &&
                            cluster.childNodeIds.length !== 0,
                    );
                }
            }
        }
        if (nodes) {
            if (
                typeof nodes.currentValue !== "undefined" &&
                nodes.currentValue !== nodes.previousValue
            ) {
                if (typeof nodes.currentValue !== "undefined") {
                    this.graphNodes = nodes.currentValue;
                }
            }
        }
    }

    public onClickNode(node: any, label: string): void {
        this.onClickNodeEvent.emit(label);
    }

    // See: https://stackoverflow.com/questions/62874476/ngx-graph-linktemplate-links-middle-pointer-alignment-issue
    public getXYForCenteredLinkCircle(link: Edge): [number, number] {
        const myPath: SVGPathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
        );
        myPath.setAttributeNS(null, "d", link.line as string);
        const length: number = myPath.getTotalLength();
        const p: DOMPoint = myPath.getPointAtLength(length / 2);
        return [p.x, p.y]; // Consider the center coordinates of the circle
    }
}
