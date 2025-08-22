/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { catchError, combineLatest, EMPTY, map, switchMap } from "rxjs";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

export const datasetViewResolverFn: ResolveFn<DatasetViewData> = (route: ActivatedRouteSnapshot) => {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const accountName = route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;
    return datasetService.requestDatasetMainData({ accountName, datasetName }).pipe(
        switchMap(() => {
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
