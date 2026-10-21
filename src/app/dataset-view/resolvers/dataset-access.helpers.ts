/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand } from "@angular/router";

import { catchError, combineLatest, first, map, Observable, of, switchMap, throwError } from "rxjs";

import { DatasetNotFoundError } from "@common/values/errors";
import { DatasetKind } from "@api/kamu.graphql.interface";
import { DatasetInfo } from "@interface/navigation.interface";

import { DatasetViewData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

/**
 * Loads the dataset with the current user's permissions. Emits them once, or the page-not-found
 * redirect when the dataset does not exist; other errors propagate. Call it from a resolver.
 */
export function requestDatasetWithPermissions(datasetInfo: DatasetInfo): Observable<DatasetViewData | RedirectCommand> {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);

    return datasetService.requestDatasetBasicDataWithPermissions(datasetInfo).pipe(
        switchMap(() =>
            combineLatest([datasetService.datasetChanges, datasetSubsService.permissionsChanges]).pipe(first()),
        ),
        map(([datasetBasics, datasetPermissions]) => ({ datasetBasics, datasetPermissions })),
        catchError((error: unknown) =>
            error instanceof DatasetNotFoundError
                ? of(navigationService.pageNotFoundRedirect())
                : throwError(() => error),
        ),
    );
}

/**
 * Like `requestDatasetWithPermissions`, but redirects to the dataset overview unless the user may
 * commit metadata to the dataset and it is of `expectedKind`. Call it from a resolver.
 */
export function requestEditableDataset(
    datasetInfo: DatasetInfo,
    expectedKind: DatasetKind,
): Observable<DatasetViewData | RedirectCommand> {
    const navigationService = inject(NavigationService);

    return requestDatasetWithPermissions(datasetInfo).pipe(
        map((data) => {
            if (data instanceof RedirectCommand) {
                return data;
            }
            const isEditable =
                data.datasetPermissions.permissions.metadata.canCommit && data.datasetBasics.kind === expectedKind;
            return isEditable
                ? data
                : new RedirectCommand(
                      navigationService.datasetViewUrlTree({ ...datasetInfo, tab: DatasetViewTypeEnum.Overview }),
                  );
        }),
    );
}
