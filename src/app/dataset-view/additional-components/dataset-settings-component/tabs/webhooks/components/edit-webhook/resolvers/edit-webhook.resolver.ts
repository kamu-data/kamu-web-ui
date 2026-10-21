/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { catchError, map, of, switchMap } from "rxjs";

import { DatasetBasicsFragment, WebhookSubscription } from "@api/kamu.graphql.interface";

import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const editWebhookResolverFn: ResolveFn<EditWebhooksType> = (route: ActivatedRouteSnapshot) => {
    const datasetService = inject(DatasetService);
    const datasetWebhooksService = inject(DatasetWebhooksService);
    const navigationService = inject(NavigationService);

    const webhookId = route.paramMap.get(ProjectLinks.URL_PARAM_WEBHOOK_ID) as string;

    return datasetService.datasetChanges.pipe(
        switchMap((datasetBasics: DatasetBasicsFragment) =>
            datasetWebhooksService.datasetWebhookSubscriptionById({ datasetId: datasetBasics.id, id: webhookId }).pipe(
                map((subscription: WebhookSubscription) => {
                    return {
                        datasetBasics,
                        subscription,
                    };
                }),
                catchError(() => of(navigationService.pageNotFoundRedirect())),
            ),
        ),
    );
};
