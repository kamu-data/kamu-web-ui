import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { Node } from "@swimlane/ngx-graph";
import { BaseComponent } from "src/app/common/components/base.component";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";
import { LineageGraphUpdate } from "./lineage-model";
import { MaybeNull } from "src/app/interface/app.types";
@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    @Output() public onClickNodeEmit = new EventEmitter<Node>();
    @Output() public onClickPrivateNodeEmit = new EventEmitter<Node>();
    public lineageGraphUpdate$: Observable<MaybeNull<LineageGraphUpdate>>;

    private lineageGraphBuilderService = inject(LineageGraphBuilderService);

    public onClickNode(node: Node): void {
        this.onClickNodeEmit.emit(node);
    }

    public onClickPrivateNode(node: Node): void {
        this.onClickPrivateNodeEmit.emit(node);
    }

    public ngOnInit(): void {
        this.lineageGraphUpdate$ = this.lineageGraphBuilderService.buildGraph();
    }
}
