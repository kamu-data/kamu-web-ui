import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { ClusterNode, Node } from "@swimlane/ngx-graph/lib/models/node.model";

@Component({
    selector: "app-linage",
    templateUrl: "./linage-component.html",
})

export class LinageComponent {
    @Input() public linageGraphView: [number, number];
    @Input() public isAvailableLinageGraph: boolean;
    @Input() public linageGraphLink: Edge[];
    @Input() public linageGraphNodes: Node[];
    @Input() public linageGraphClusters: ClusterNode[];
    @Output() onClickNodeEmit: EventEmitter<string> = new EventEmitter();

    public onClickNode(idDataset: string): void {
        this.onClickNodeEmit.emit(idDataset);
    }
}
