/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Routes } from "@angular/router";

import { AddWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/add-webhook.component";
import { addWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/add-webhook/resolvers/add-webhook.resolver";
import { EditWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhook.component";
import { editWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/resolvers/edit-webhook.resolver";
import { ListWebhooksComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/list-webhooks/list-webhooks.component";
import { rotateSecretWebhookResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/rotate-secret-webhook/resolvers/rotate-secret-webhook.resolver";
import { RotateSecretWebhookComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/rotate-secret-webhook/rotate-secret-webhook.component";
import { datasetSettingsWebhooksResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import ProjectLinks from "src/app/project-links";

import RoutingResolvers from "@common/resolvers/routing-resolvers";

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
            [RoutingResolvers.WEBHOOKS_ADD_NEW_KEY]: addWebhookResolverFn,
        },
        component: AddWebhookComponent,
    },
    {
        path: ProjectLinks.URL_WEBHOOK_ROTATE_SECRET,
        children: [
            {
                path: `:${ProjectLinks.URL_PARAM_WEBHOOK_ID}`,
                resolve: {
                    [RoutingResolvers.WEBHOOKS_ROTATE_SECRET]: rotateSecretWebhookResolverFn,
                },
                component: RotateSecretWebhookComponent,
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_WEBHOOK_ID}`,
        resolve: {
            [RoutingResolvers.WEBHOOKS_EDIT_KEY]: editWebhookResolverFn,
        },
        component: EditWebhookComponent,
    },
];
