/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { WebhookSubscription } from "@api/kamu.graphql.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";
import { DatasetSettingsWebhookTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";

export const datasetSettingsWebhooksResolverFn: ResolveFn<DatasetSettingsWebhookTabData> = () => {
    const datasetWebhooksService = inject(DatasetWebhooksService);

    return resolveSettingsTabAccess(SettingsTabsEnum.WEBHOOKS).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return datasetWebhooksService
                .datasetWebhookSubscriptions(data.datasetBasics.id)
                .pipe(map((subscriptions: WebhookSubscription[]) => ({ ...data, subscriptions })));
        }),
    );
};
