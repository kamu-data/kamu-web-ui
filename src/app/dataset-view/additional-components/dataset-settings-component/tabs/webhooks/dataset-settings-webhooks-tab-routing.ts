import { AddWebhookComponent } from "./components/add-webhook/add-webhook.component";
/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Routes } from "@angular/router";
import { ListWebhooksComponent } from "./components/list-webhooks/list-webhooks.component";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { datasetSettingsWebhooksResolverFn } from "./resolver/dataset-settings-webhooks.resolver";
import { EditWebhookComponent } from "./components/edit-webhook/edit-webhook.component";
import { addWebhookResolverFn } from "./components/add-webhook/resolvers/add-webhook.resolver";
import { editWebhookResolverFn } from "./components/edit-webhook/resolvers/edit-webhook.resolver";
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
            [RoutingResolvers.WEBHOOKS_ADD_NEW_KEY]: addWebhookResolverFn,
        },
        component: AddWebhookComponent,
    },
    {
        path: `:${ProjectLinks.URL_PARAM_WEBHOOK_ID}`,
        resolve: {
            [RoutingResolvers.WEBHOOKS_EDIT_KEY]: editWebhookResolverFn,
        },
        component: EditWebhookComponent,
    },
];
