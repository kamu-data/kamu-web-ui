/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { AccountTabs } from "../account/account.constants";
import { AccountFlowsTabComponent } from "../account/additional-components/account-flows-tab/account-flows-tab.component";
import { DatasetsTabComponent } from "../account/additional-components/datasets-tab/datasets-tab.component";
import { accountDatasetsResolverFn } from "../account/additional-components/datasets-tab/resolver/account-datasets.resolver";
import { SettingsTabComponent } from "../account/additional-components/settings-tab/settings-tab.component";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import ProjectLinks from "../project-links";

export const accountSelectRoutes: Routes = [
    {
        path: ``,
        redirectTo: AccountTabs.DATASETS,
        pathMatch: "full",
    },
    {
        path: AccountTabs.DATASETS,
        component: DatasetsTabComponent,
        data: {
            [ProjectLinks.URL_PARAM_TAB]: AccountTabs.DATASETS,
        },
        resolve: { [RoutingResolvers.ACCOUNT_DATASETS_KEY]: accountDatasetsResolverFn },
        runGuardsAndResolvers: "always",
    },
    {
        path: AccountTabs.FLOWS,
        data: {
            [ProjectLinks.URL_PARAM_TAB]: AccountTabs.FLOWS,
        },
        canActivate: [AuthenticatedGuard],
        component: AccountFlowsTabComponent,
    },
    {
        path: AccountTabs.SETTINGS,
        data: {
            [ProjectLinks.URL_PARAM_TAB]: AccountTabs.SETTINGS,
        },
        canActivate: [AuthenticatedGuard],
        component: SettingsTabComponent,
    },
];
