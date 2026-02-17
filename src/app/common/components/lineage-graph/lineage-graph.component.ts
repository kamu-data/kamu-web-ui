/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DecimalPipe, NgIf, TitleCasePipe } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
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
import { MatIconModule } from "@angular/material/icon";

import { GraphModule, Node } from "@swimlane/ngx-graph";
import { DatasetKind, DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import {
    LineageGraph,
    LineageGraphNodeKind,
    LineageNodeAccess,
} from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { MaybeUndefined } from "src/app/interface/app.types";
import { SessionStorageService } from "src/app/services/session-storage.service";

import { DisplayDatasetIdPipe } from "../../pipes/display-dataset-id.pipe";
import { DisplaySizePipe } from "../../pipes/display-size.pipe";
import { DisplayTimeComponent } from "../display-time/display-time.component";
import { LINEAGE_CONFIG, LineageGraphConfig } from "./ligeage-graph.settings";
import { WidgetHeightService } from "./widget-height.service";

@Component({
    selector: "app-lineage-graph",
    templateUrl: "./lineage-graph.component.html",
    styleUrls: ["./lineage-graph.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        DecimalPipe,
        NgIf,
        TitleCasePipe,
        //-----//
        GraphModule,
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
    public view: [number, number];
    public showSidePanel = true;

    @ViewChild("containerRef", { static: false }) private element: MaybeUndefined<ElementRef>;
    @HostListener("window:resize")
    public checkWindowSize(): void {
        this.changeLineageGraphView();
    }

    private sessionStorageService = inject(SessionStorageService);
    private widgetHeightService = inject(WidgetHeightService);

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

    private checkVisibilitySidePanel(): void {
        this.showSidePanel = this.sessionStorageService.isSidePanelVisible;
    }

    private lineageGraphHeight(): number {
        return this.widgetHeightService.widgetHeight;
    }
}
