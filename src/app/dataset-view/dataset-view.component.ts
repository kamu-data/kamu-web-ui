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
import { AppConfigService } from "../app-config.service";
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
    private configService = inject(AppConfigService);
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

    public get enableScheduling(): boolean {
        return this.configService.featureFlags.enableScheduling;
    }

    // private initFlowsTab(datasetInfo: DatasetInfo): void {
    //     this.mainDatasetQueryComplete$
    //         .pipe(
    //             filter(
    //                 (info: DatasetInfo) =>
    //                     info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
    //             ),
    //             first(),
    //             switchMap(() => this.datasetPermissions$.pipe(first())),
    //             takeUntilDestroyed(this.destroyRef),
    //         )
    //         .subscribe((datasetPermissions: DatasetPermissionsFragment) => {
    //             if (this.datasetPermissionsServices.shouldAllowFlowsTab(datasetPermissions) && this.enableScheduling) {
    //                 this.datasetViewType = DatasetViewTypeEnum.Flows;
    //             } else {
    //                 this.datasetViewType = DatasetViewTypeEnum.Overview;
    //             }
    //             this.cdr.detectChanges();
    //         });
    // }

    // private initHistoryTab(datasetInfo: DatasetInfo, currentPage: number): void {
    //     this.datasetViewType = DatasetViewTypeEnum.History;

    //     this.mainDatasetQueryComplete$
    //         .pipe(
    //             filter(
    //                 (info: DatasetInfo) =>
    //                     info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
    //             ),
    //             first(),
    //             switchMap((info: DatasetInfo) => {
    //                 /* istanbul ignore else */
    //                 if (this.datasetViewType === DatasetViewTypeEnum.History) {
    //                     return this.datasetService.requestDatasetHistory(info, 20, currentPage - 1);
    //                 } else {
    //                     return of();
    //                 }
    //             }),
    //             takeUntilDestroyed(this.destroyRef),
    //         )
    //         .subscribe();
    // }

    // public initDiscussionsTab(): void {
    //     promiseWithCatch(
    //         this.modalService.warning({
    //             message: "Feature coming soon",
    //             yesButtonText: "Ok",
    //         }),
    //     );
    // }

    // public initSettingsTab(datasetInfo: DatasetInfo): void {
    //     this.mainDatasetQueryComplete$
    //         .pipe(
    //             filter(
    //                 (info: DatasetInfo) =>
    //                     info.accountName === datasetInfo.accountName && info.datasetName === datasetInfo.datasetName,
    //             ),
    //             first(),
    //             switchMap(() => this.datasetPermissions$.pipe(first())),
    //             takeUntilDestroyed(this.destroyRef),
    //         )
    //         .subscribe((datasetPermissions: DatasetPermissionsFragment) => {
    //             if (this.datasetPermissionsServices.shouldAllowSettingsTab(datasetPermissions)) {
    //                 this.datasetViewType = DatasetViewTypeEnum.Settings;
    //             } else {
    //                 this.datasetViewType = DatasetViewTypeEnum.Overview;
    //             }
    //             this.cdr.detectChanges();
    //         });
    // }
}
