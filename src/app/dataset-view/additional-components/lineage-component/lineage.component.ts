import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Node } from "@swimlane/ngx-graph";
import { BaseComponent } from "src/app/common/base.component";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";
import { LineageGraphUpdate } from "./lineage-model";
import { MaybeNull } from "src/app/common/app.types";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Output() onClickNodeEmit = new EventEmitter<Node>();
    public lineageGraphUpdate$: Observable<MaybeNull<LineageGraphUpdate>>;
    constructor(private lineageGraphBuilderService: LineageGraphBuilderService) {
        super();
    }

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }

    public ngOnInit(): void {
        this.lineageGraphUpdate$ = this.lineageGraphBuilderService.buildGraph();
    }
}
