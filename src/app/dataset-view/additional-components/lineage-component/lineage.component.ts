/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { Node } from "@swimlane/ngx-graph";
import { BaseComponent } from "src/app/common/components/base.component";
import { LineageGraphNodeData, LineageGraphNodeKind, LineageGraphUpdate } from "./lineage-model";
import { MaybeNull } from "src/app/interface/app.types";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { ToastrService } from "ngx-toastr";
import { Clipboard } from "@angular/cdk/clipboard";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetService } from "../../dataset.service";
import { LineageGraphBuilderService } from "./services/lineage-graph-builder.service";
import { Observable, switchMap } from "rxjs";
import { LineageGraphComponent } from "../../../common/components/lineage-graph/lineage-graph.component";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, LineageGraphComponent, AsyncPipe],
})
export class LineageComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_INFO_KEY) public set datasetInfo(value: DatasetInfo) {
        this.datasetInfoData = value;
        this.buildGraph();
    }
    public lineageGraphUpdate$: Observable<MaybeNull<LineageGraphUpdate>>;

    public datasetInfoData: DatasetInfo;
    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);
    private navigationService = inject(NavigationService);
    private lineageGraphBuilderService = inject(LineageGraphBuilderService);
    private datasetService = inject(DatasetService);

    private buildGraph(): void {
        this.lineageGraphUpdate$ = this.datasetService
            .requestDatasetLineage(this.datasetInfoData)
            .pipe(switchMap(() => this.lineageGraphBuilderService.buildGraph()));
    }

    public onClickNode(node: Node): void {
        const nodeData: LineageGraphNodeData = node.data as LineageGraphNodeData;
        /* istanbul ignore else */
        if (nodeData.kind === LineageGraphNodeKind.Dataset) {
            this.onSelectDataset(nodeData.dataObject.accountName, nodeData.dataObject.name);
        } else {
            throw new Error("Clicked lineage node of unexpected type");
        }
    }

    public onClickPrivateNode(node: Node): void {
        this.clipboard.copy(node.id);
        this.toastr.success("Copied ID");
    }

    public onSelectDataset(accountName?: string, datasetName?: string): void {
        this.navigationService.navigateToDatasetView({
            accountName: accountName ?? this.datasetInfoData.accountName,
            datasetName: datasetName ?? this.datasetInfoData.datasetName,
            tab: DatasetViewTypeEnum.Lineage,
        });
    }
}
