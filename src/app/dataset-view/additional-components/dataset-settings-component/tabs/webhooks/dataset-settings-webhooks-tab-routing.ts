/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Routes } from "@angular/router";

import { validRouteParams } from "@common/guards/valid-route-params.guard";
import { isUuid } from "@common/helpers/url-params.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { AddWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/add-webhook.component";
import { EditWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhook.component";
import { editWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/resolvers/edit-webhook.resolver";
import { ListWebhooksComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/list-webhooks/list-webhooks.component";
import { RotateSecretWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/rotate-secret-webhook/rotate-secret-webhook.component";
import { datasetSettingsWebhooksResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import { webhooksDatasetResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/webhooks-dataset.resolver";
import ProjectLinks from "src/app/project-links";

export const WEBHOOKS_TAB_ROUTING: Routes = [
    {
        path: "",
        runGuardsAndResolvers: "always",
        resolve: {
            [RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY]: datasetSettingsWebhooksResolverFn,
        },
        component: ListWebhooksComponent,
    },
    {
        path: ProjectLinks.URL_WEBHOOK_NEW,
        resolve: {
            [RoutingResolvers.WEBHOOKS_ADD_NEW_KEY]: webhooksDatasetResolverFn,
        },
        component: AddWebhookComponent,
    },
    {
        path: `${ProjectLinks.URL_WEBHOOK_ROTATE_SECRET}/:${ProjectLinks.URL_PARAM_WEBHOOK_ID}`,
        canActivate: [validRouteParams({ [ProjectLinks.URL_PARAM_WEBHOOK_ID]: isUuid })],
        resolve: {
            [RoutingResolvers.WEBHOOKS_ROTATE_SECRET]: editWebhookResolverFn,
        },
        component: RotateSecretWebhookComponent,
    },
    {
        path: `:${ProjectLinks.URL_PARAM_WEBHOOK_ID}`,
        canActivate: [validRouteParams({ [ProjectLinks.URL_PARAM_WEBHOOK_ID]: isUuid })],
        resolve: {
            [RoutingResolvers.WEBHOOKS_EDIT_KEY]: editWebhookResolverFn,
        },
        component: EditWebhookComponent,
    },
];
