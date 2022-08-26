import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage-component.html",
})
export class LineageComponent {
    @Input() public lineageGraphView: [number, number];
    @Input() public isAvailableLineageGraph: boolean;
    @Input() public lineageGraphLink: Edge[];
    @Input() public lineageGraphNodes: Node[];
    @Input() public lineageGraphClusters: ClusterNode[];
    @Output() onClickNodeEmit = new EventEmitter<Node>();

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }
}
