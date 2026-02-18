/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";

import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { AccountComponent } from "src/app/account/account.component";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountFlowsTabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.component";
import { accountFlowsResolverFn } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
import { DatasetsTabComponent } from "src/app/account/additional-components/datasets-tab/datasets-tab.component";
import { accountDatasetsResolverFn } from "src/app/account/additional-components/datasets-tab/resolver/account-datasets.resolver";
import { SettingsTabComponent } from "src/app/account/additional-components/settings-tab/settings-tab.component";
import { accountActiveTabResolverFn } from "src/app/account/resolver/account-active-tab.resolver";
import { AuthenticatedGuard } from "src/app/auth/guards/authenticated.guard";
import ProjectLinks from "src/app/project-links";

export const ACCOUNT_SELECT_ROUTES: Routes = [
    {
        path: "",
        component: AccountComponent,
        runGuardsAndResolvers: "always",
        resolve: { [RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY]: accountActiveTabResolverFn },
        children: [
            {
                path: ProjectLinks.URL_ACCOUNT_SELECT,
                children: [
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
                        resolve: { [RoutingResolvers.ACCOUNT_FLOWS_KEY]: accountFlowsResolverFn },
                        runGuardsAndResolvers: "always",
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
                ],
            },
        ],
    },
];
