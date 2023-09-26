import { Observable, combineLatest, of, switchMap } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { Edge } from "@swimlane/ngx-graph/lib/models/edge.model";
import { DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Output() onClickNodeEmit = new EventEmitter<Node>();

    public lineageGraphLinks$: Observable<Edge[]>;
    public lineageGraphNodes$: Observable<Node[]>;
    public currentDataset: DatasetLineageBasicsFragment;
    public currentDataset$: Observable<DatasetLineageBasicsFragment>;

    constructor(private lineageGraphBuilderService: LineageGraphBuilderService) {
        super();
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }

    public ngOnInit(): void {
        this.currentDataset$ = this.lineageGraphBuilderService.getCurrentDataset();
        this.lineageGraphNodes$ = combineLatest([
            this.lineageGraphBuilderService.buildSourceNodes(),
            this.lineageGraphBuilderService.buildDatasetGraphNodes(),
        ]).pipe(switchMap(([sourceNodes, datasetNodes]: [Node[], Node[]]) => of(sourceNodes.concat(datasetNodes))));
        this.lineageGraphLinks$ = combineLatest([
            this.lineageGraphBuilderService.onLineageSourceLinkChanges,
            this.lineageGraphBuilderService.buildLinkNodes(),
            this.lineageGraphNodes$,
        ]).pipe(
            switchMap(([sourceLinks, datasetLinks]: [Edge[], Edge[], Node[]]) => of(sourceLinks.concat(datasetLinks))),
        );
    }
}
