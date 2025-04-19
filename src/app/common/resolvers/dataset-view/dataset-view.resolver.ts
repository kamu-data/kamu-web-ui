/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { catchError, combineLatest, EMPTY, map, of, switchMap } from "rxjs";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { activeTabResolver } from "../active-tab.resolver";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

export const datasetViewResolver: ResolveFn<DatasetViewData> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const accountName = route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;
    const activeTab = activeTabResolver(route, state);

    return datasetService.requestDatasetMainData({ accountName, datasetName }).pipe(
        switchMap(() => datasetService.datasetChanges),
        switchMap((data: DatasetBasicsFragment) =>
            [DatasetViewTypeEnum.History, DatasetViewTypeEnum.Flows, DatasetViewTypeEnum.Settings].includes(
                activeTab as DatasetViewTypeEnum,
            )
                ? of(false)
                : datasetService.isHeadHashBlockChanged(data),
        ),
        switchMap((isHeadHashBlockChanged: boolean) => {
            if (isHeadHashBlockChanged) {
                navigationService.navigateToDatasetView({
                    accountName,
                    datasetName,
                    tab: DatasetViewTypeEnum.Overview,
                });
            }
            return combineLatest([datasetService.datasetChanges, datasetSubService.permissionsChanges]).pipe(
                map(([datasetBasics, datasetPermissions]) => {
                    return {
                        datasetBasics,
                        datasetPermissions,
                    };
                }),
            );
        }),
        catchError(() => {
            navigationService.navigateToPageNotFound();
            return EMPTY;
        }),
    );
};
