/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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
import { blockMetadataResolverFn } from "./dataset-block/metadata-block/resolver/block-metadata.resolver";
import { searchResolverFn } from "./search/resolver/search.resolver";
import RoutingResolvers from "./common/resolvers/routing-resolvers";
import { accountGuard } from "./account/guards/account.guard";
import { AccountWhitelistNotFoundComponent } from "./common/components/account-whitelist-not-found/account-whitelist-not-found.component";
import { Provider } from "@angular/core";
import { forbidAnonymousAccessGuardFn } from "./common/guards/forbid-anonymous-access.guard";
import { AppConfigService } from "./app-config.service";
import { accessTokenExpiredGuardFn } from "./common/guards/access-token-expired.guard";

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
        loadComponent: () =>
            import(
                /* webpackChunkName: "dataset-create" */
                "./dataset-create/dataset-create.component"
            ).then((m) => m.DatasetCreateComponent),
    },
    {
        path: ProjectLinks.URL_QUERY_EXPLAINER,
        loadComponent: () =>
            import(/* webpackChunkName: "query-explainer" */ "./query-explainer/query-explainer.component").then(
                (m) => m.QueryExplainerComponent,
            ),
    },
    {
        path: ProjectLinks.URL_QUERY,
        loadComponent: () =>
            import(/* webpackChunkName: "global-query" */ "./query/global-query/global-query.component").then(
                (m) => m.GlobalQueryComponent,
            ),
    },
    {
        path: `${ProjectLinks.URL_SETTINGS}`,
        canActivate: [AuthenticatedGuard],
        runGuardsAndResolvers: "always",
        loadChildren: () =>
            import(
                /* webpackChunkName: "account-settings" */
                "./account/settings/account-settings-routing"
            ).then((m) => m.ACCOUNT_SETTINGS_ROUTES),
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}`,
        children: [
            {
                path: "",
                canActivate: [accountGuard],
                runGuardsAndResolvers: "always",
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "account-select" */
                        "./account/additional-components/account-select-routing"
                    ).then((m) => m.ACCOUNT_SELECT_ROUTES),
            },
            {
                path: `:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
                runGuardsAndResolvers: "always",
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "dataset-view" */
                        "./dataset-view/dataset-view-routing"
                    ).then((m) => m.DATASET_VIEW_ROUTES),
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
        children: [
            {
                path: `${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
                loadComponent: () =>
                    import(
                        /* webpackChunkName: "metadata-block" */
                        "./dataset-block/metadata-block/metadata-block.component"
                    ).then((m) => m.MetadataBlockComponent),
                resolve: { [RoutingResolvers.METADATA_BLOCK_KEY]: blockMetadataResolverFn },
            },
            {
                path: `${ProjectLinks.URL_FLOW_DETAILS}/:${ProjectLinks.URL_PARAM_FLOW_ID}`,
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "flow-details" */
                        "./dataset-flow/dataset-flow-details/flow-details-routing"
                    ).then((m) => m.FLOW_DETAILS_ROUTES),
            },
            {
                path: "",
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "dataset-source-events" */
                        "./dataset-view/additional-components/metadata-component/components/source-events/source-events-routing"
                    ).then((m) => m.SOURCE_EVENTS_ROUTES),
            },
        ],
    },
    {
        canActivate: [AdminGuard],
        path: ProjectLinks.URL_ADMIN_DASHBOARD,
        // In future, we might want to lazy load this component
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
