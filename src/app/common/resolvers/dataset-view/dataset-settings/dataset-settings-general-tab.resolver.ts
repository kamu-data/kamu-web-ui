/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { combineLatest, map } from "rxjs";
import { AppConfigService } from "src/app/app-config.service";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";
import { datasetSettingsActiveSectionResolver } from "../dataset-settings-active-section.resolver";
import { isSettingsTabAccessibleHelper } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.helpers";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetMetadata } from "src/app/api/kamu.graphql.interface";

export const datasetSettingsGeneralTabResolver: ResolveFn<DatasetViewData | null> = (route, state) => {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const appConfigService = inject(AppConfigService);
    const activeTab = datasetSettingsActiveSectionResolver(route, state) as SettingsTabsEnum;

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubService.permissionsChanges,
        datasetSubService.overviewChanges,
    ]).pipe(
        map(([datasetBasics, datasetPermissions, overviewUpdate]) => {
            if (
                isSettingsTabAccessibleHelper(
                    activeTab,
                    appConfigService.featureFlags,
                    datasetBasics,
                    datasetPermissions,
                    overviewUpdate.overview.metadata as DatasetMetadata,
                )
            ) {
                return {
                    datasetBasics,
                    datasetPermissions,
                };
            } else {
                navigationService.navigateToPageNotFound();
                return null;
            }
        }),
    );
};
