/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { catchError, combineLatest, EMPTY, map } from "rxjs";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const datasetOverviewTabResolverFn: ResolveFn<DatasetOverviewTabData> = (route: ActivatedRouteSnapshot) => {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const pathPrefix = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX) ?? "/";

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubsService.permissionsChanges,
        datasetSubsService.overviewChanges,
    ]).pipe(
        map(([datasetBasics, datasetPermissions, overviewUpdate]) => {
            return {
                datasetBasics,
                datasetPermissions,
                overviewUpdate,
                pathPrefix,
            };
        }),
        catchError(() => {
            navigationService.navigateToPageNotFound();
            return EMPTY;
        }),
    );
};
