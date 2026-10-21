/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand } from "@angular/router";

import { catchError, combineLatest, map, Observable, of, OperatorFunction } from "rxjs";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

/**
 * Emits the current dataset with the user's permissions and the dataset overview, or the
 * page-not-found redirect when any of them fails. Call it from a resolver.
 */
export function requestOverviewTabData(): Observable<DatasetOverviewTabData | RedirectCommand> {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubsService.permissionsChanges,
        datasetSubsService.overviewChanges,
    ]).pipe(
        map(([datasetBasics, datasetPermissions, overviewUpdate]) => ({
            datasetBasics,
            datasetPermissions,
            overviewUpdate,
        })),
        catchError(() => of(navigationService.pageNotFoundRedirect())),
    );
}

/**
 * Replaces each value for which `isUnavailable` holds with the page-not-found redirect; a
 * redirect from upstream passes through unchanged. Call it from a resolver.
 */
export function pageNotFoundIf<T>(
    isUnavailable: (data: T) => boolean,
): OperatorFunction<T | RedirectCommand, T | RedirectCommand> {
    const navigationService = inject(NavigationService);

    return map((data) =>
        data instanceof RedirectCommand || !isUnavailable(data) ? data : navigationService.pageNotFoundRedirect(),
    );
}
