/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { AccountTabs } from "../account.constants";
import { AccountFlowsTabComponent } from "./account-flows-tab/account-flows-tab.component";
import { DatasetsTabComponent } from "./datasets-tab/datasets-tab.component";
import { accountDatasetsResolverFn } from "./datasets-tab/resolver/account-datasets.resolver";
import { SettingsTabComponent } from "./settings-tab/settings-tab.component";
import { AuthenticatedGuard } from "../../auth/guards/authenticated.guard";
import RoutingResolvers from "../../common/resolvers/routing-resolvers";
import ProjectLinks from "../../project-links";
import { AccountComponent } from "../account.component";
import { accountActiveTabResolverFn } from "../resolver/account-active-tab.resolver";
import { accountFlowsResolverFn } from "./account-flows-tab/resolvers/account-flows.resolver";

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
