import { Observable } from "rxjs";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { Node } from "@swimlane/ngx-graph";
import { BaseComponent } from "src/app/common/base.component";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";
import { LineageGraphNodeData, LineageGraphNodeKind, LineageGraphUpdate } from "./lineage-model";
import { MaybeNull } from "src/app/common/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent implements OnInit {
    public lineageGraphUpdate$: Observable<MaybeNull<LineageGraphUpdate>>;

    private lineageGraphBuilderService = inject(LineageGraphBuilderService);
    private navigationService = inject(NavigationService);

    public onClickNode(node: Node): void {
        const nodeData: LineageGraphNodeData = node.data as LineageGraphNodeData;
        /* istanbul ignore else */
        if (nodeData.kind === LineageGraphNodeKind.Dataset) {
            this.onSelectDataset(nodeData.dataObject.accountName, nodeData.dataObject.name);
        } else {
            throw new Error("Clicked lineage node of unexpected type");
        }
    }

    public onSelectDataset(accountName?: string, datasetName?: string): void {
        this.navigationService.navigateToDatasetView({
            accountName: accountName ? accountName : this.getDatasetInfoFromUrl().accountName,
            datasetName: datasetName ? datasetName : this.getDatasetInfoFromUrl().datasetName,
            tab: DatasetViewTypeEnum.Lineage,
        });
    }

    public ngOnInit(): void {
        this.lineageGraphUpdate$ = this.lineageGraphBuilderService.buildGraph();
    }
}
