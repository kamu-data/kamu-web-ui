import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    ViewChild,
} from "@angular/core";
import { Node } from "@swimlane/ngx-graph";
import { DatasetKind, DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import {
    LineageGraph,
    LineageGraphNodeKind,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { LineageGraphConfig, LINEAGE_CONFIG } from "./ligeage-graph.settings";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    styleUrls: ["./lineage-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageGraphComponent {
    @Input() public graph: LineageGraph;
    @Input() public currentDataset: DatasetLineageBasicsFragment;

    @Output() public onClickNodeEvent = new EventEmitter<Node>();

    public readonly LineageGraphNodeKind: typeof LineageGraphNodeKind = LineageGraphNodeKind;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;

    public readonly LINEAGE_CONFIG: LineageGraphConfig = LINEAGE_CONFIG;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly INITIAL_GRAPH_VIEW_HEIGHT: number = screen.height - 400;
    public readonly INITIAL_GRAPH_VIEW_WIDTH: number = window.innerWidth - 120;

    public view: [number, number] = [this.INITIAL_GRAPH_VIEW_WIDTH, this.INITIAL_GRAPH_VIEW_HEIGHT];
    public showSidePanel = false;

    @ViewChild("containerRef", { static: false }) element: ElementRef;
    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    public changeLineageGraphView(): void {
        const containerGraph = this.element.nativeElement as HTMLDivElement;
        const styleElement: CSSStyleDeclaration = getComputedStyle(containerGraph);
        this.view[0] =
            containerGraph.clientWidth -
            parseInt(styleElement.paddingLeft, 10) -
            parseInt(styleElement.paddingRight, 10);
        this.view[1] = this.INITIAL_GRAPH_VIEW_HEIGHT;
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEvent.emit(node);
    }

    public onClickInfo(): void {
        this.showSidePanel = !this.showSidePanel;
    }
}
