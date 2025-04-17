/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SessionStorageService } from "src/app/services/session-storage.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy } from "@angular/core";
import { DatasetViewData, DatasetViewTypeEnum } from "./dataset-view.interface";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { BaseDatasetDataComponent } from "../common/components/base-dataset-data.component";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import { DatasetInfo } from "../interface/navigation.interface";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewComponent extends BaseDatasetDataComponent implements OnDestroy {
    @Input(RoutingResolvers.DATASET_VIEW_ACTIVE_TAB_KEY) public datasetViewType: DatasetViewTypeEnum;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;
    @Input(RoutingResolvers.DATASET_VIEW_KEY) public datasetViewData: DatasetViewData;

    public readonly DatasetViewTypeEnum = DatasetViewTypeEnum;
    private sessionStorageService = inject(SessionStorageService);

    public get datasetBasics(): DatasetBasicsFragment {
        return this.datasetViewData.datasetBasics;
    }

    public get datasetPermissions(): DatasetPermissionsFragment {
        return this.datasetViewData.datasetPermissions;
    }

    public ngOnDestroy(): void {
        this.sessionStorageService.removeDatasetSqlCode();
    }
}
