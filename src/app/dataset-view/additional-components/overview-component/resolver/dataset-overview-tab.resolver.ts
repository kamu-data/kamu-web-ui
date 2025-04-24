/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { catchError, EMPTY } from "rxjs";
/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { combineLatest, map } from "rxjs";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

export const datasetOverviewTabResolverFn: ResolveFn<DatasetOverviewTabData> = () => {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);

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
            };
        }),
        catchError(() => {
            navigationService.navigateToPageNotFound();
            return EMPTY;
        }),
    );
};
