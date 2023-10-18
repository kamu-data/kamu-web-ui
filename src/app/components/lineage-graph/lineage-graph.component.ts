import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
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
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    styleUrls: ["./lineage-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageGraphComponent implements OnInit {
    @Input() public graph: LineageGraph;
    @Input() public currentDataset: DatasetLineageBasicsFragment;
    @Output() public onClickNodeEvent = new EventEmitter<Node>();
    public readonly LineageGraphNodeKind: typeof LineageGraphNodeKind = LineageGraphNodeKind;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;
    public readonly LINEAGE_CONFIG: LineageGraphConfig = LINEAGE_CONFIG;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly INITIAL_GRAPH_VIEW_WIDTH: number = window.innerWidth - 120;
    public view: [number, number];
    public showSidePanel = false;

    @ViewChild("containerRef", { static: false }) element: ElementRef;
    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    constructor(private sessionStorageService: SessionStorageService) {}

    public ngOnInit(): void {
        this.view = [this.INITIAL_GRAPH_VIEW_WIDTH, this.lineageGraphHeight()];
        this.checkVisibilitySidePanel();
    }

    public changeLineageGraphView(): void {
        const containerGraph = this.element.nativeElement as HTMLDivElement;
        const styleElement: CSSStyleDeclaration = getComputedStyle(containerGraph);
        this.view[0] =
            containerGraph.clientWidth -
            parseInt(styleElement.paddingLeft, 10) -
            parseInt(styleElement.paddingRight, 10);
        this.view[1] = this.lineageGraphHeight();
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEvent.emit(node);
    }

    public onClickInfo(): void {
        this.showSidePanel = !this.showSidePanel;
        this.sessionStorageService.setSidePanelVisible(this.showSidePanel);
    }

    private checkVisibilitySidePanel(): void {
        this.showSidePanel = this.sessionStorageService.isSidePanelVisible;
    }

    private lineageGraphHeight(): number {
        // TODO: Calculate the size of the graph taking the size of the components

        // const headerViewMenuElement = document.getElementById("app-dataset-view-header");
        // const datasetTabsElement = document.getElementById("container-dataset-tabs");
        // const headerElement = document.getElementById("app-header");
        // if (headerViewMenuElement && datasetTabsElement && headerElement) {
        //     const headerHeight = headerElement.getBoundingClientRect().height;
        //     const headerViewHeight = headerViewMenuElement.getBoundingClientRect().height;
        //     const headerMarginTop = +getComputedStyle(headerViewMenuElement).marginTop.split("px")[0];
        //     const datasetTabsElementHeight = datasetTabsElement.getBoundingClientRect().height;
        //     return (
        //         window.innerHeight - (headerHeight + headerViewHeight + headerMarginTop + 2 * datasetTabsElementHeight)
        //     );
        // }
        return screen.height - 390;
    }
}
