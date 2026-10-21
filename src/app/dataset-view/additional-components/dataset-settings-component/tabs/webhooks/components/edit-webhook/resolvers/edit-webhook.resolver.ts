/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { catchError, map, of, switchMap } from "rxjs";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const editWebhookResolverFn: ResolveFn<EditWebhooksType> = (route: ActivatedRouteSnapshot) => {
    const datasetWebhooksService = inject(DatasetWebhooksService);
    const navigationService = inject(NavigationService);

    const webhookId = route.paramMap.get(ProjectLinks.URL_PARAM_WEBHOOK_ID) as string;

    return resolveSettingsTabAccess(SettingsTabsEnum.WEBHOOKS).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return datasetWebhooksService
                .datasetWebhookSubscriptionById({ datasetId: data.datasetBasics.id, id: webhookId })
                .pipe(
                    map((subscription) =>
                        subscription
                            ? { datasetBasics: data.datasetBasics, subscription }
                            : navigationService.pageNotFoundRedirect(),
                    ),
                    catchError(() => of(navigationService.pageNotFoundRedirect())),
                );
        }),
    );
};
