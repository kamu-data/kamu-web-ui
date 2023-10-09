import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Node } from "@swimlane/ngx-graph";

import { DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";
import { LineageGraph } from "./lineage-model";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Output() onClickNodeEmit = new EventEmitter<Node>();
    public lineageGraph$: Observable<LineageGraph>;
    public currentDataset$: Observable<DatasetLineageBasicsFragment>;

    constructor(private lineageGraphBuilderService: LineageGraphBuilderService) {
        super();
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }

    public ngOnInit(): void {
        this.currentDataset$ = this.lineageGraphBuilderService.currentDatasetChanges();
        this.lineageGraph$ = this.lineageGraphBuilderService.buildGraph();
    }
}
