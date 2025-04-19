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
@Component({
    selector: "app-lineage",
    templateUrl: "./lineage.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineageComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_VIEW_LINEAGE_KEY) public lineageGraphUpdate: MaybeNull<LineageGraphUpdate>;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    private clipboard = inject(Clipboard);
    private toastr = inject(ToastrService);
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

    public onClickPrivateNode(node: Node): void {
        this.clipboard.copy(node.id);
        this.toastr.success("Copied ID");
    }

    public onSelectDataset(accountName?: string, datasetName?: string): void {
        this.navigationService.navigateToDatasetView({
            accountName: accountName ?? this.datasetInfo.accountName,
            datasetName: datasetName ?? this.datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.Lineage,
        });
    }
}
