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
import { Node, Edge, MiniMapPosition } from "@swimlane/ngx-graph";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { LineageGraphNodeKind } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageGraphComponent implements OnChanges, OnInit {
    @Input() public view: [number, number];
    @Input() public links: Edge[];
    @Input() public nodes: Node[];

    @Output() public onClickNodeEvent = new EventEmitter<Node>();

    public draggingEnabled = false;
    public panningEnabled = true;
    public zoomEnabled = true;
    public zoomSpeed = 0.03;
    public minZoomLevel = 0.3;
    public maxZoomLevel = 4.0;
    public panOnZoom = true;
    public autoZoom = true;
    public autoCenter = true;
    public showMiniMap = true;
    public miniMapPosition: MiniMapPosition;
    public graphNodes: Node[];

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly LineageGraphNodeKind: typeof LineageGraphNodeKind = LineageGraphNodeKind;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;

    public ngOnInit(): void {
        this.graphNodes = this.nodes;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const nodes: SimpleChange = changes.nodes;
        if (nodes.currentValue && nodes.currentValue !== nodes.previousValue) {
            this.graphNodes = nodes.currentValue as Node[];
        }
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEvent.emit(node);
    }
}
