/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DecimalPipe, TitleCasePipe } from "@angular/common";
import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";

import { timer } from "rxjs";

import {
    GraphComponent,
    LayoutService,
    NgxGraphStateChangeEvent,
    NgxGraphStates,
    Node,
    NodeDimension,
} from "@swimlane/ngx-graph";

import { DisplayTimeComponent } from "@common/components/display-time/display-time.component";
import { LINEAGE_CONFIG, LineageGraphConfig } from "@common/components/lineage-graph/ligeage-graph.settings";
import { WidgetHeightService } from "@common/components/lineage-graph/widget-height.service";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import AppValues from "@common/values/app.values";
import { DatasetKind, DatasetLineageBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import {
    LineageGraph,
    LineageGraphNodeKind,
    LineageNodeAccess,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { SessionStorageService } from "src/app/services/session-storage.service";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    styleUrls: ["./lineage-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // GraphComponent injects LayoutService, but ngx-graph provides it only through its deprecated GraphModule
    providers: [LayoutService],
    imports: [
        //-----//
        DecimalPipe,
        TitleCasePipe,
        //-----//
        GraphComponent,
        MatIconModule,
        //-----//
        DisplayTimeComponent,
        DisplayDatasetIdPipe,
        DisplaySizePipe,
    ],
})
export class LineageGraphComponent implements OnInit, OnChanges {
    @Input({ required: true }) public graph: LineageGraph;
    @Input({ required: true }) public currentDataset: DatasetLineageBasicsFragment;
    @Output() public onClickNodeEvent = new EventEmitter<Node>();
    @Output() public onClickPrivateNodeEvent = new EventEmitter<Node>();

    public readonly LineageGraphNodeKind: typeof LineageGraphNodeKind = LineageGraphNodeKind;
    public readonly LineageNodeAccess: typeof LineageNodeAccess = LineageNodeAccess;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;
    public readonly LINEAGE_CONFIG: LineageGraphConfig = LINEAGE_CONFIG;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly INITIAL_GRAPH_VIEW_WIDTH: number = window.innerWidth - 120;
    private static readonly MINIMAP_THROTTLE_MS = 500;

    public view: [number, number];
    public showSidePanel = true;

    @ViewChild("containerRef", { static: false }) private element: MaybeUndefined<ElementRef>;
    @ViewChild(GraphComponent) private graphComponent: MaybeUndefined<GraphComponent>;
    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    private sessionStorageService = inject(SessionStorageService);
    private widgetHeightService = inject(WidgetHeightService);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);

    public constructor() {
        // The initial view width is a guess from the window; the container is measurable only once rendered
        afterNextRender(() => {
            this.changeLineageGraphView();
            this.cdr.markForCheck();
        });
    }

    public ngOnInit(): void {
        this.view = [this.INITIAL_GRAPH_VIEW_WIDTH, this.lineageGraphHeight()];
        this.checkVisibilitySidePanel();
    }

    public ngOnChanges(): void {
        this.changeLineageGraphView();
    }

    public changeLineageGraphView(): void {
        if (this.element?.nativeElement) {
            const containerGraph = this.element.nativeElement as HTMLDivElement;
            const styleElement: CSSStyleDeclaration = getComputedStyle(containerGraph);
            this.view = [
                containerGraph.clientWidth -
                    parseInt(styleElement.paddingLeft, 10) -
                    parseInt(styleElement.paddingRight, 10),
                this.lineageGraphHeight(),
            ];
        }
    }

    public onGraphStateChange(event: NgxGraphStateChangeEvent): void {
        // Output follows every finished layout (new graph, resized view), never a user's zoom or pan
        if (event.state === NgxGraphStates.Output) {
            this.fitGraph();
        }
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEvent.emit(node);
    }

    public onClickPrivateNode(node: Node): void {
        this.onClickPrivateNodeEvent.emit(node);
    }

    public onClickInfo(): void {
        this.showSidePanel = !this.showSidePanel;
        this.sessionStorageService.setSidePanelVisible(this.showSidePanel);
    }

    public get isPrivateVisibility(): boolean {
        return this.currentDataset.visibility.__typename === "PrivateDatasetVisibility";
    }

    /**
     * Zooms out until the graph fits, never zooming in past 1, and centres it in the part of the
     * view the minimap and the side panel leave free.
     */
    private fitGraph(): void {
        // ngx-graph's own autoZoom/autoCenter skip centring when the zoom stays the same, and its center()
        // ignores where the graph's bounding box starts, so the fit is computed here
        const graph = this.graphComponent;
        if (!graph) {
            return;
        }
        // ngx-graph declares graphDims as any; it holds the padded bounding box of the laid-out nodes
        const graphDims = graph.graphDims as NodeDimension;
        if (!graphDims.width || !graphDims.height) {
            return;
        }
        const leftInset = LINEAGE_CONFIG.miniMapMaxWidth + LINEAGE_CONFIG.overlayGap;
        const rightInset = this.showSidePanel ? LINEAGE_CONFIG.sidePanelWidth + LINEAGE_CONFIG.overlayGap : 0;
        const freeWidth = Math.max(graph.dims.width - leftInset - rightInset, 1);
        const zoomLevel = Math.min(
            Math.max(
                Math.min(freeWidth / graphDims.width, graph.dims.height / graphDims.height, 1),
                LINEAGE_CONFIG.minZoomLevel,
            ),
            LINEAGE_CONFIG.maxZoomLevel,
        );
        // zoom() scales in place; zoomTo() would either relayout or, with layout: false, make the next update
        // skip the relayout that applies the measured node sizes
        graph.zoom(zoomLevel / graph.zoomLevel);
        // panTo() puts the given graph point at the view centre; shift it so the graph lands in the free area
        graph.panTo(
            graph.minimapOffsetX + graphDims.width / 2 + (rightInset - leftInset) / 2 / zoomLevel,
            graph.minimapOffsetY + graphDims.height / 2,
        );
        // ngx-graph throttles updateMinimap(), and the delayed call after a layout does not re-render its
        // OnPush view, which leaves the minimap scaled for the graph before node sizes were measured
        timer(LineageGraphComponent.MINIMAP_THROTTLE_MS)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => graph.cd.markForCheck());
    }

    private checkVisibilitySidePanel(): void {
        this.showSidePanel = this.sessionStorageService.isSidePanelVisible;
    }

    private lineageGraphHeight(): number {
        return this.widgetHeightService.widgetHeight;
    }
}
