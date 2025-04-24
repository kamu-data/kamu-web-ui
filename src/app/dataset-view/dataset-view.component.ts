/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SessionStorageService } from "src/app/services/session-storage.service";
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { DatasetViewData, DatasetViewTypeEnum } from "./dataset-view.interface";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { BaseDatasetDataComponent } from "../common/components/base-dataset-data.component";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import { DatasetInfo } from "../interface/navigation.interface";
import { NavigationEnd, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EMPTY, filter, switchMap } from "rxjs";

@Component({
    selector: "app-dataset",
    templateUrl: "./dataset-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewComponent extends BaseDatasetDataComponent implements OnInit, OnDestroy {
    @Input(RoutingResolvers.DATASET_VIEW_ACTIVE_TAB_KEY) public datasetViewType: DatasetViewTypeEnum;
    @Input(RoutingResolvers.DATASET_INFO_KEY) public datasetInfo: DatasetInfo;
    @Input(RoutingResolvers.DATASET_VIEW_KEY) public datasetViewData: DatasetViewData;

    public readonly DatasetViewTypeEnum = DatasetViewTypeEnum;
    private sessionStorageService = inject(SessionStorageService);
    private router = inject(Router);

    public ngOnInit(): void {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.checkHeadHashBlock();
            });
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.datasetViewData.datasetBasics;
    }

    public get datasetPermissions(): DatasetPermissionsFragment {
        return this.datasetViewData.datasetPermissions;
    }

    private checkHeadHashBlock(): void {
        if (
            [
                DatasetViewTypeEnum.Overview,
                DatasetViewTypeEnum.Data,
                DatasetViewTypeEnum.Metadata,
                DatasetViewTypeEnum.Lineage,
            ].includes(this.datasetViewType)
        ) {
            this.datasetService
                .isHeadHashBlockChanged(this.datasetBasics)
                .pipe(
                    switchMap((isHeadHashBlockChanged: boolean) => {
                        if (isHeadHashBlockChanged) {
                            this.navigationService.navigateToDatasetView({
                                accountName: this.datasetInfo.accountName,
                                datasetName: this.datasetInfo.datasetName,
                                tab: this.datasetViewType,
                            });
                        }
                        return EMPTY;
                    }),
                )
                .subscribe();
        }
    }

    public ngOnDestroy(): void {
        this.sessionStorageService.removeDatasetSqlCode();
    }
}
