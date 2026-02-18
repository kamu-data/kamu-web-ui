/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { combineLatest, map, switchMap } from "rxjs";

import { DatasetMetadata, WebhookSubscription } from "@api/kamu.graphql.interface";

import { AppConfigService } from "src/app/app-config.service";
import { isSettingsTabAccessibleHelper } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.helpers";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetSettingsWebhookTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const datasetSettingsWebhooksResolverFn: ResolveFn<DatasetSettingsWebhookTabData | null> = (
    route: ActivatedRouteSnapshot,
) => {
    const datasetService = inject(DatasetService);
    const datasetSubService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    const appConfigService = inject(AppConfigService);
    const datasetWebhooksService = inject(DatasetWebhooksService);
    const activeTab = route.data[ProjectLinks.URL_PARAM_TAB] as SettingsTabsEnum;

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubService.permissionsChanges,
        datasetSubService.overviewChanges,
    ]).pipe(
        switchMap(([datasetBasics, datasetPermissions, overviewUpdate]) =>
            datasetWebhooksService.datasetWebhookSubscriptions(datasetBasics.id).pipe(
                map((subscriptions: WebhookSubscription[]) => ({
                    datasetBasics,
                    datasetPermissions,
                    overviewUpdate,
                    subscriptions,
                })),
                map(({ datasetBasics, datasetPermissions, overviewUpdate, subscriptions }) => {
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
                            subscriptions,
                        };
                    } else {
                        navigationService.navigateToPageNotFound();
                        return null;
                    }
                }),
            ),
        ),
    );
};
