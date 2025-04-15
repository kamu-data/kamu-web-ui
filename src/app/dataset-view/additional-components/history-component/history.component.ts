/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetHistoryUpdate } from "../../dataset.subscriptions.interface";
import { MaybeNull } from "src/app/interface/app.types";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent extends BaseComponent {
    @Input(RoutingResolvers.DATASET_VIEW_HISTORY_KEY) public datasetHistoryTabData: MaybeNull<DatasetHistoryUpdate>;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;

    private navigationService = inject(NavigationService);

    public onPageChange(page: number): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetInfo.accountName,
            datasetName: this.datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.History,
            page,
        });
    }
}
