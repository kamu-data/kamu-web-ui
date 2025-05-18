/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { catchError, combineLatest, EMPTY, map, switchMap } from "rxjs";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { LocalStorageService } from "src/app/services/local-storage.service";

export const datasetViewResolverFn: ResolveFn<DatasetViewData> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const localStorageService = inject(LocalStorageService);
    const accountName = route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;

    return datasetService.requestDatasetMainData({ accountName, datasetName }).pipe(
        switchMap(() => {
            return combineLatest([datasetService.datasetChanges, datasetSubService.permissionsChanges]).pipe(
                map(([datasetBasics, datasetPermissions]) => {
                    localStorageService.setRedirectAfterLoginUrl(null);
                    return {
                        datasetBasics,
                        datasetPermissions,
                    };
                }),
            );
        }),
        catchError(() => {
            localStorageService.setRedirectAfterLoginUrl(state.url);
            navigationService.navigateToPageNotFound();
            return EMPTY;
        }),
    );
};
