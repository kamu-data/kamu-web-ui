/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { GlobalQueryComponent } from "./query/global-query/global-query.component";
import { AuthenticatedGuard } from "./auth/guards/authenticated.guard";
import { PageNotFoundComponent } from "./common/components/page-not-found/page-not-found.component";
import { ROUTES, Routes } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { LoginComponent } from "./auth/login/login.component";
import { GithubCallbackComponent } from "./auth/login/github-callback/github.callback";
import ProjectLinks from "./project-links";
import { LoginGuard } from "./auth/guards/login.guard";
import { ReturnToCliComponent } from "./auth/login/return-to-cli/return-to-cli.component";
import { AdminGuard } from "./auth/guards/admin.guard";
import { AdminDashboardComponent } from "./admin-view/admin-dashboard/admin-dashboard.component";
import { DatasetFlowDetailsComponent } from "./dataset-flow/dataset-flow-details/dataset-flow-details.component";
import { blockMetadataResolverFn } from "./dataset-block/metadata-block/resolver/block-metadata.resolver";
import { searchResolverFn } from "./search/resolver/search.resolver";
import RoutingResolvers from "./common/resolvers/routing-resolvers";
import { accountGuard } from "./account/guards/account.guard";
import { flowDetailsResolverFn } from "./dataset-flow/dataset-flow-details/resolvers/flow-details.resolver";
import { datasetInfoResolverFn } from "./common/resolvers/dataset-info.resolver";
import { datasetViewResolverFn } from "./dataset-view/resolvers/dataset-view.resolver";
import { accountSettingsActiveTabResolverFn } from "./account/settings/resolver/account-settings-active-tab.resolver";
import { accountActiveTabResolverFn } from "./account/resolver/account-active-tab.resolver";
import { datasetViewActiveTabResolverFn } from "./dataset-view/resolvers/dataset-view-active-tab.resolver";
import { flowDetailsActiveTabResolverFn } from "./dataset-flow/dataset-flow-details/resolvers/flow-details-active-tab.resolver";
import { AccountWhitelistNotFoundComponent } from "./common/components/account-whitelist-not-found/account-whitelist-not-found.component";
import { Provider } from "@angular/core";
import { forbidAnonymousAccessGuardFn } from "./common/guards/forbid-anonymous-access.guard";
import { AppConfigService } from "./app-config.service";
import { accessTokenExpiredGuardFn } from "./common/guards/access-token-expired.guard";
import { AccountSettingsComponent } from "./account/settings/account-settings.component";
import { AccountComponent } from "./account/account.component";
import { DatasetViewComponent } from "./dataset-view/dataset-view.component";

export const PUBLIC_ROUTES: Routes = [
    { path: "", redirectTo: ProjectLinks.DEFAULT_URL, pathMatch: "full" },
    {
        path: ProjectLinks.URL_PAGE_NOT_FOUND,
        component: PageNotFoundComponent,
    },
    {
        path: ProjectLinks.URL_ACCOUNT_WHITELIST_PAGE_NOT_FOUND,
        component: AccountWhitelistNotFoundComponent,
    },
    {
        path: ProjectLinks.URL_LOGIN,
        component: LoginComponent,
        canActivate: [LoginGuard],
    },
    {
        path: ProjectLinks.URL_GITHUB_CALLBACK,
        component: GithubCallbackComponent,
    },
    {
        path: ProjectLinks.URL_RETURN_TO_CLI,
        component: ReturnToCliComponent,
    },
];

export const ANONYMOUS_GUARDED_ROUTES: Routes = [
    {
        path: ProjectLinks.URL_SEARCH,
        component: SearchComponent,
        resolve: { [RoutingResolvers.SEARCH_KEY]: searchResolverFn },
        runGuardsAndResolvers: "always",
    },
    {
        canActivate: [AuthenticatedGuard],
        path: ProjectLinks.URL_DATASET_CREATE,
        loadComponent: () => import("./dataset-create/dataset-create.component").then((m) => m.DatasetCreateComponent),
    },
    {
        path: ProjectLinks.URL_QUERY_EXPLAINER,
        loadComponent: () =>
            import("./query-explainer/query-explainer.component").then((m) => m.QueryExplainerComponent),
    },
    {
        path: ProjectLinks.URL_QUERY,
        component: GlobalQueryComponent,
        loadChildren: () => import("./query/query.module").then((m) => m.QueryModule),
    },
    {
        path: `${ProjectLinks.URL_SETTINGS}`,
        canActivate: [AuthenticatedGuard],
        component: AccountSettingsComponent,
        runGuardsAndResolvers: "always",
        resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACTIVE_TAB_KEY]: accountSettingsActiveTabResolverFn },
        loadChildren: () => import("./children-routing/account-settings-routing").then((m) => m.accountSettingsRoutes),
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}`,
        children: [
            {
                path: "",
                component: AccountComponent,
                canActivate: [accountGuard],
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY]: accountActiveTabResolverFn },
                children: [
                    {
                        path: ProjectLinks.URL_ACCOUNT_SELECT,
                        loadChildren: () =>
                            import("./children-routing/account-select-routing").then((m) => m.accountSelectRoutes),
                    },
                ],
            },
            {
                path: `:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
                component: DatasetViewComponent,
                runGuardsAndResolvers: "always",
                resolve: {
                    [RoutingResolvers.DATASET_VIEW_KEY]: datasetViewResolverFn,
                    [RoutingResolvers.DATASET_VIEW_ACTIVE_TAB_KEY]: datasetViewActiveTabResolverFn,
                    [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                },
                loadChildren: () => import("./children-routing/dataset-view-routing").then((m) => m.datasetViewRoutes),
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
        children: [
            {
                path: `${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
                loadComponent: () =>
                    import("./dataset-block/metadata-block/metadata-block.component").then(
                        (m) => m.MetadataBlockComponent,
                    ),
                resolve: { [RoutingResolvers.METADATA_BLOCK_KEY]: blockMetadataResolverFn },
            },
            {
                path: `${ProjectLinks.URL_FLOW_DETAILS}/:${ProjectLinks.URL_PARAM_FLOW_ID}`,
                component: DatasetFlowDetailsComponent,
                canActivate: [AuthenticatedGuard],
                runGuardsAndResolvers: "always",
                resolve: {
                    [RoutingResolvers.FLOW_DETAILS_ACTIVE_TAB_KEY]: flowDetailsActiveTabResolverFn,
                    [RoutingResolvers.FLOW_DETAILS_KEY]: flowDetailsResolverFn,
                    [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                },
                loadChildren: () => import("./children-routing/flow-details-routing").then((m) => m.flowDetailsRoutes),
            },
            {
                path: "",
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import("./children-routing/source-events-routing").then((m) => m.sourceEventsRoutes),
            },
        ],
    },
    {
        canActivate: [AdminGuard],
        path: ProjectLinks.URL_ADMIN_DASHBOARD,
        component: AdminDashboardComponent,
    },
];

export const provideConditionalGuardedRoutes = (): Provider => ({
    provide: ROUTES,
    multi: true,
    useFactory: (appConfigService: AppConfigService) => {
        return [
            {
                path: "",
                canActivate: appConfigService.allowAnonymous
                    ? [accessTokenExpiredGuardFn]
                    : [forbidAnonymousAccessGuardFn, accessTokenExpiredGuardFn],
                children: ANONYMOUS_GUARDED_ROUTES,
                runGuardsAndResolvers: "always",
            },
        ];
    },
    deps: [AppConfigService],
});

export const provideCatchAllRoute = (): Provider => ({
    provide: ROUTES,
    multi: true,
    useValue: [
        {
            path: "**",
            component: PageNotFoundComponent,
        },
    ],
});
