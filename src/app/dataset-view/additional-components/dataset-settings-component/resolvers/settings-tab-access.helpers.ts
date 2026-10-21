/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand } from "@angular/router";

import { combineLatest, map, Observable } from "rxjs";

import { DatasetMetadata } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { isSettingsTabAccessibleHelper } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.helpers";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

/**
 * Emits the current dataset with the user's permissions when the settings tab is accessible to
 * them, otherwise the page-not-found redirect. Call it from a resolver.
 */
export function resolveSettingsTabAccess(tab: SettingsTabsEnum): Observable<DatasetViewData | RedirectCommand> {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const appConfigService = inject(AppConfigService);

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubService.permissionsChanges,
        datasetSubService.overviewChanges,
    ]).pipe(
        map(([datasetBasics, datasetPermissions, overviewUpdate]) => {
            const isAccessible = isSettingsTabAccessibleHelper(
                tab,
                appConfigService.featureFlags,
                datasetBasics,
                datasetPermissions,
                overviewUpdate.overview.metadata as DatasetMetadata,
            );
            return isAccessible ? { datasetBasics, datasetPermissions } : navigationService.pageNotFoundRedirect();
        }),
    );
}
