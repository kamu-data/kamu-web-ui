import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
} from "@angular/core";
import { Node, Edge, MiniMapPosition } from "@swimlane/ngx-graph";
import { DatasetKind, DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { LineageGraphNodeKind } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    styleUrls: ["./lineage-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageGraphComponent implements OnChanges, OnInit {
    @Input() public links: Edge[];
    @Input() public nodes: Node[];
    @Input() public currentDataset: DatasetLineageBasicsFragment;

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
    public INITIAL_GRAPH_VIEW_HEIGHT: number = screen.height - 400;
    public INITIAL_GRAPH_VIEW_WIDTH: number = window.innerWidth - 100;
    public view: [number, number] = [this.INITIAL_GRAPH_VIEW_WIDTH, this.INITIAL_GRAPH_VIEW_HEIGHT];
    public showSidePanel = false;

    @HostListener("window:resize")
    private checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    public ngOnInit(): void {
        this.graphNodes = this.nodes;
    }

    public changeLineageGraphView(): void {
        const searchResultContainer: MaybeNull<HTMLElement> = document.getElementById("searchResultContainerContent");
        if (searchResultContainer) {
            const styleElement: CSSStyleDeclaration = getComputedStyle(searchResultContainer);
            this.view[0] =
                searchResultContainer.offsetWidth -
                parseInt(styleElement.paddingLeft, 10) -
                parseInt(styleElement.paddingRight, 10);
            this.view[1] = this.INITIAL_GRAPH_VIEW_HEIGHT;
        }
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

    public onClickInfo(): void {
        this.showSidePanel = !this.showSidePanel;
        this.view = [this.INITIAL_GRAPH_VIEW_WIDTH, this.INITIAL_GRAPH_VIEW_HEIGHT];
    }
}
