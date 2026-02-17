/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Routes } from "@angular/router";

import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import ProjectLinks from "src/app/project-links";

import { AddWebhookComponent } from "./components/add-webhook/add-webhook.component";
import { addWebhookResolverFn } from "./components/add-webhook/resolvers/add-webhook.resolver";
import { EditWebhookComponent } from "./components/edit-webhook/edit-webhook.component";
import { editWebhookResolverFn } from "./components/edit-webhook/resolvers/edit-webhook.resolver";
import { ListWebhooksComponent } from "./components/list-webhooks/list-webhooks.component";
import { rotateSecretWebhookResolverFn } from "./components/rotate-secret-webhook/resolvers/rotate-secret-webhook.resolver";
import { RotateSecretWebhookComponent } from "./components/rotate-secret-webhook/rotate-secret-webhook.component";
import { datasetSettingsWebhooksResolverFn } from "./resolver/dataset-settings-webhooks.resolver";

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
