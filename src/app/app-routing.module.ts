/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { GlobalQueryComponent } from "./query/global-query/global-query.component";
import { AddPollingSourceComponent } from "./dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
import { MetadataBlockComponent } from "./dataset-block/metadata-block/metadata-block.component";
import { AuthenticatedGuard } from "./auth/guards/authenticated.guard";
import { AccountSettingsComponent } from "./account/settings/account-settings.component";
import { PageNotFoundComponent } from "./common/components/page-not-found/page-not-found.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { LoginComponent } from "./auth/login/login.component";
import { DatasetViewComponent } from "./dataset-view/dataset-view.component";
import { DatasetCreateComponent } from "./dataset-create/dataset-create.component";
import { GithubCallbackComponent } from "./auth/login/github-callback/github.callback";
import ProjectLinks from "./project-links";
import { SetTransformComponent } from "./dataset-view/additional-components/metadata-component/components/set-transform/set-transform.component";
import { LoginGuard } from "./auth/guards/login.guard";
import { ReturnToCliComponent } from "./auth/login/return-to-cli/return-to-cli.component";
import { AddPushSourceComponent } from "./dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source.component";
import { AdminGuard } from "./auth/guards/admin.guard";
import { AdminDashboardComponent } from "./admin-view/admin-dashboard/admin-dashboard.component";
import { DatasetFlowDetailsComponent } from "./dataset-flow/dataset-flow-details/dataset-flow-details.component";
import { AccountComponent } from "./account/account.component";
import { QueryExplainerComponent } from "./query-explainer/query-explainer.component";
import { blockMetadataResolver } from "./common/resolvers/block-metadata.resolver";
import { searchResolver } from "./common/resolvers/search.resolver";
import { addPollingSourceResolver } from "./common/resolvers/add-polling-source.resolver";
import { setTransformResolver } from "./common/resolvers/set-transform.resolver";
import { addPushSourceResolver } from "./common/resolvers/add-push-source.resolver";
import { AccountSettingsTabs } from "./account/settings/account-settings.constants";
import RoutingResolvers from "./common/resolvers/routing-resolvers";
import { accountDatasetsResolver } from "./common/resolvers/account-datasets.resolver";
import { AccountTabs } from "./account/account.constants";
import { DatasetsTabComponent } from "./account/additional-components/datasets-tab/datasets-tab.component";
import { AccountFlowsTabComponent } from "./account/additional-components/account-flows-tab/account-flows-tab.component";
import { accountGuard } from "./account/guards/account.guard";
import { AccessTokensTabComponent } from "./account/settings/tabs/access-tokens-tab/access-tokens-tab.component";
import { EmailsTabComponent } from "./account/settings/tabs/emails-tab/emails-tab.component";
import { accountSettingsEmailResolver } from "./common/resolvers/account-settings-email.resolver";
import { accountSettingsAccessTokensResolver } from "./common/resolvers/account-settings-access-tokens.resolver";
import { activeTabResolver } from "./common/helpers/data.helpers";

export const routes: Routes = [
    { path: "", redirectTo: ProjectLinks.DEFAULT_URL, pathMatch: "full" },
    {
        path: ProjectLinks.URL_PAGE_NOT_FOUND,
        component: PageNotFoundComponent,
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
    {
        path: ProjectLinks.URL_SEARCH,
        component: SearchComponent,
        resolve: { [RoutingResolvers.SEARCH_KEY]: searchResolver },
        runGuardsAndResolvers: "always",
    },
    {
        canActivate: [AuthenticatedGuard],
        path: ProjectLinks.URL_DATASET_CREATE,
        component: DatasetCreateComponent,
    },
    {
        path: ProjectLinks.URL_QUERY_EXPLAINER,
        component: QueryExplainerComponent,
        loadChildren: () => import("./query-explainer/query-explainer.module").then((m) => m.QueryExplainerModule),
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
        resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACTIVE_TAB_KEY]: activeTabResolver(AccountSettingsTabs) },
        children: [
            {
                path: "",
                redirectTo: AccountSettingsTabs.ACCESS_TOKENS,
                pathMatch: "full",
            },
            {
                path: AccountSettingsTabs.ACCESS_TOKENS,
                component: AccessTokensTabComponent,
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACCESS_TOKENS_KEY]: accountSettingsAccessTokensResolver },
            },
            {
                path: AccountSettingsTabs.EMAILS,
                component: EmailsTabComponent,
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_EMAIL_KEY]: accountSettingsEmailResolver },
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}`,
        children: [
            {
                path: "",
                component: AccountComponent,
                canActivate: [accountGuard],
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY]: activeTabResolver(AccountTabs) },
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
                                resolve: { [RoutingResolvers.ACCOUNT_DATASETS_KEY]: accountDatasetsResolver },
                                runGuardsAndResolvers: "always",
                            },
                            {
                                path: AccountTabs.FLOWS,
                                component: AccountFlowsTabComponent,
                            },
                        ],
                    },
                ],
            },
            {
                path: `:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
                component: DatasetViewComponent,
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
        children: [
            {
                path: `${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
                component: MetadataBlockComponent,
                resolve: { [RoutingResolvers.METADATA_BLOCK_KEY]: blockMetadataResolver },
            },
            {
                path: "",
                canActivate: [AuthenticatedGuard],
                children: [
                    {
                        path: `${ProjectLinks.URL_FLOW_DETAILS}/:${ProjectLinks.URL_PARAM_FLOW_ID}/:${ProjectLinks.URL_PARAM_CATEGORY}`,
                        component: DatasetFlowDetailsComponent,
                    },
                    {
                        path: `${ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE}`,
                        component: AddPollingSourceComponent,
                        resolve: { [RoutingResolvers.ADD_POLLING_SOURCE_KEY]: addPollingSourceResolver },
                    },
                    {
                        path: `${ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE}`,
                        component: AddPushSourceComponent,
                        resolve: { [RoutingResolvers.ADD_PUSH_SOURCE_KEY]: addPushSourceResolver },
                    },
                    {
                        path: `${ProjectLinks.URL_PARAM_SET_TRANSFORM}`,
                        component: SetTransformComponent,
                        resolve: { [RoutingResolvers.SET_TRANSFORM_KEY]: setTransformResolver },
                    },
                ],
            },
        ],
    },
    {
        canActivate: [AdminGuard],
        path: ProjectLinks.URL_ADMIN_DASHBOARD,
        component: AdminDashboardComponent,
    },

    {
        path: "**",
        component: PageNotFoundComponent,
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: "reload",
            bindToComponentInputs: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
