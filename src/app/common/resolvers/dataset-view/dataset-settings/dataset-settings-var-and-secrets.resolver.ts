/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { AppConfigService } from "src/app/app-config.service";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetEvnironmentVariablesService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-evnironment-variables.service";
import { VariablesAndSecretsData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { datasetSettingsActiveSectionResolver } from "../dataset-settings-active-section.resolver";
import { combineLatest, map, of, switchMap } from "rxjs";
import { ViewDatasetEnvVarConnection } from "src/app/api/kamu.graphql.interface";

export const datasetSettingsVarAndSecretsResolver: ResolveFn<VariablesAndSecretsData> = (route, state) => {
    const evnironmentVariablesService = inject(DatasetEvnironmentVariablesService);
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const appConfigService = inject(AppConfigService);
    const activeTab = datasetSettingsActiveSectionResolver(route, state) as SettingsTabsEnum;

    const accountName = route.parent?.parent?.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.parent?.parent?.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;
    const page = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1;
    const PER_PAGE = 15;

    const tabData$ = evnironmentVariablesService
        .listEnvVariables({
            accountName,
            datasetName,
            page: Number(page) - 1,
            perPage: PER_PAGE,
        })
        .pipe(
            switchMap((connection: ViewDatasetEnvVarConnection) =>
                combineLatest([
                    of(connection),
                    datasetService.datasetChanges,
                    datasetSubService.permissionsChanges,
                ]).pipe(
                    map(([connection, datasetBasics, datasetPermissions]) => {
                        return {
                            connection,
                            datasetBasics,
                            datasetPermissions,
                        };
                    }),
                ),
            ),
        );

    return tabData$;

    // combineLatest([
    //     datasetService.datasetChanges,
    //     datasetSubService.permissionsChanges,
    //     datasetSubService.overviewChanges,
    // ]).pipe(
    //     map(([datasetBasics, datasetPermissions, overviewUpdate]) => {
    //         if (
    //             isSettingsTabAccessibleHelper(
    //                 activeTab,
    //                 appConfigService.featureFlags,
    //                 datasetBasics,
    //                 datasetPermissions,
    //                 overviewUpdate.overview.metadata as DatasetMetadata,
    //             )
    //         ) {
    //             return tabData$;
    //         } else {
    //             navigationService.navigateToPageNotFound();
    //             return EMPTY;
    //         }
    //     }),
    // );
};
