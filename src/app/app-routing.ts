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
import { Routes } from "@angular/router";
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
import { blockMetadataResolverFn } from "./dataset-block/metadata-block/resolver/block-metadata.resolver";
import { searchResolverFn } from "./search/resolver/search.resolver";
import { addPollingSourceResolverFn } from "./dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/resolver/add-polling-source.resolver";
import { setTransformResolverFn } from "./dataset-view/additional-components/metadata-component/components/set-transform/resolver/set-transform.resolver";
import { addPushSourceResolverFn } from "./dataset-view/additional-components/metadata-component/components/source-events/add-push-source/resolver/add-push-source.resolver";
import { AccountSettingsTabs } from "./account/settings/account-settings.constants";
import RoutingResolvers from "./common/resolvers/routing-resolvers";
import { accountDatasetsResolverFn } from "./account/additional-components/datasets-tab/resolver/account-datasets.resolver";
import { AccountTabs } from "./account/account.constants";
import { DatasetsTabComponent } from "./account/additional-components/datasets-tab/datasets-tab.component";
import { AccountFlowsTabComponent } from "./account/additional-components/account-flows-tab/account-flows-tab.component";
import { accountGuard } from "./account/guards/account.guard";
import { FlowDetailsTabs } from "./dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowDetailsLogsTabComponent } from "./dataset-flow/dataset-flow-details/tabs/flow-details-logs-tab/flow-details-logs-tab.component";
import { FlowDetailsUsageTabComponent } from "./dataset-flow/dataset-flow-details/tabs/flow-details-usage-tab/flow-details-usage-tab.component";
import { FlowDetailsAdminTabComponent } from "./dataset-flow/dataset-flow-details/tabs/flow-details-admin-tab/flow-details-admin-tab.component";
import { flowDetailsResolverFn } from "./dataset-flow/dataset-flow-details/resolvers/flow-details.resolver";
import { datasetInfoResolverFn } from "./common/resolvers/dataset-info.resolver";
import { FlowDetailsSummaryTabComponent } from "./dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/flow-details-summary-tab.component";
import { flowDetailsSummaryResolverFn } from "./dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/resolver/flow-details-summary.resolver";
import { FlowDetailsHistoryTabComponent } from "./dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.component";
import { AccessTokensTabComponent } from "./account/settings/tabs/access-tokens-tab/access-tokens-tab.component";
import { EmailsTabComponent } from "./account/settings/tabs/emails-tab/emails-tab.component";
import { accountSettingsEmailResolverFn } from "./account/settings/tabs/emails-tab/resolver/account-settings-email.resolver";
import { accountSettingsAccessTokensResolverFn } from "./account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { DatasetViewTypeEnum } from "./dataset-view/dataset-view.interface";
import { OverviewComponent } from "./dataset-view/additional-components/overview-component/overview.component";
import { datasetOverviewTabResolverFn } from "./dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { datasetViewResolverFn } from "./dataset-view/resolvers/dataset-view.resolver";
import { FlowsComponent } from "./dataset-view/additional-components/flows-component/flows.component";
import { datasetFlowsTabResolverFn } from "./dataset-view/additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { DataComponent } from "./dataset-view/additional-components/data-component/data.component";
import { MetadataComponent } from "./dataset-view/additional-components/metadata-component/metadata.component";
import { HistoryComponent } from "./dataset-view/additional-components/history-component/history.component";
import { LineageComponent } from "./dataset-view/additional-components/lineage-component/lineage.component";
import { datasetSettingsActiveSectionResolverFn } from "./dataset-view/additional-components/dataset-settings-component/resolvers/dataset-settings-active-section.resolver";
import { DatasetSettingsComponent } from "./dataset-view/additional-components/dataset-settings-component/dataset-settings.component";
import { DatasetSettingsGeneralTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/general/dataset-settings-general-tab.component";
import { SettingsTabsEnum } from "./dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { datasetSettingsGeneralTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsTransformOptionsTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.component";
import { datasetSettingsTransformTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/transform-options/resolver/dataset-settings-transform-tab.resolver";
import { DatasetSettingsAccessTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/dataset-settings-access-tab.component";
import { DatasetSettingsSchedulingTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.component";
import { DatasetSettingsCompactingTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component";
import { DatasetSettingsSecretsManagerTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { datasetSettingsVarAndSecretsResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/variables-and-secrets/resolver/dataset-settings-var-and-secrets.resolver";
import { datasetSettingsSchedulingTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/scheduling/resolver/dataset-settings-scheduling-tab.resolver";
import { datasetSettingsAccessTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/resolver/dataset-settings-access-tab.resolver";
import { datasetSettingsCompactionTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/compacting/resolver/dataset-settings-compaction-tab.resolver";
import { datasetDataTabResolverFn } from "./dataset-view/additional-components/data-component/resolver/dataset-data-tab.resolver";
import { datasetMetadataTabResolverFn } from "./dataset-view/additional-components/metadata-component/resolver/dataset-metadata-tab.resolver";
import { datasetSettingsTabResolverFn } from "./dataset-view/additional-components/dataset-settings-component/resolvers/dataset-settings-tab.resolver";
import { accountSettingsActiveTabResolverFn } from "./account/settings/resolver/account-settings-active-tab.resolver";
import { accountActiveTabResolverFn } from "./account/resolver/account-active-tab.resolver";
import { datasetViewActiveTabResolverFn } from "./dataset-view/resolvers/dataset-view-active-tab.resolver";
import { flowDetailsActiveTabResolverFn } from "./dataset-flow/dataset-flow-details/resolvers/flow-details-active-tab.resolver";
import { AccountTabComponent } from "./account/settings/tabs/account-tab/account-tab.component";
import { SettingsTabComponent } from "./account/additional-components/settings-tab/settings-tab.component";
import { DatasetSettingsWebhooksTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component";
import { datasetSettingsWebhooksResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import { accountSettingsAccountResolverFn } from "./account/settings/tabs/account-tab/resolver/account-settings-account.resolver";
import { PasswordAndAuthenticationTabComponent } from "./account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "./account/settings/tabs/password-and-authentication-tab/resolver/account-settings-password-and-authentication.resolver";
import { accountPasswordProviderGuard } from "./common/guards/account-password-provider.guard";
import { DatasetSettingsIngestConfigurationTabComponent } from "./dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/dataset-settings-ingest-configuration-tab.component";
import { datasetSettingsIngestConfigurationResolverFn } from "./dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/resolver/dataset-settings-ingest-configuration.resolver";

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
        resolve: { [RoutingResolvers.SEARCH_KEY]: searchResolverFn },
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
        children: [
            {
                path: "",
                redirectTo: AccountSettingsTabs.ACCESS_TOKENS,
                pathMatch: "full",
            },
            {
                path: AccountSettingsTabs.ACCESS_TOKENS,
                component: AccessTokensTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCESS_TOKENS,
                },
                runGuardsAndResolvers: "always",
                resolve: {
                    [RoutingResolvers.ACCOUNT_SETTINGS_ACCESS_TOKENS_KEY]: accountSettingsAccessTokensResolverFn,
                },
            },
            {
                path: AccountSettingsTabs.EMAILS,
                component: EmailsTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.EMAILS,
                },
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_EMAIL_KEY]: accountSettingsEmailResolverFn },
            },
            {
                path: AccountSettingsTabs.ACCOUNT,
                component: AccountTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCOUNT,
                },
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACCOUNT_KEY]: accountSettingsAccountResolverFn },
            },
            {
                path: AccountSettingsTabs.SECURITY,
                component: PasswordAndAuthenticationTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.SECURITY,
                },
                runGuardsAndResolvers: "always",
                canActivate: [accountPasswordProviderGuard],
                resolve: {
                    [RoutingResolvers.ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY]:
                        accountSettingsPasswordAndAuthenticationResolverFn,
                },
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
            {
                path: `:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
                component: DatasetViewComponent,
                runGuardsAndResolvers: "always",
                resolve: {
                    [RoutingResolvers.DATASET_VIEW_KEY]: datasetViewResolverFn,
                    [RoutingResolvers.DATASET_VIEW_ACTIVE_TAB_KEY]: datasetViewActiveTabResolverFn,
                    [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                },
                children: [
                    {
                        path: DatasetViewTypeEnum.Overview,
                        redirectTo: "",
                        pathMatch: "full",
                    },
                    {
                        path: "",

                        component: OverviewComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Overview,
                        },
                        resolve: { [RoutingResolvers.DATASET_VIEW_OVERVIEW_KEY]: datasetOverviewTabResolverFn },
                    },
                    {
                        path: DatasetViewTypeEnum.Data,
                        component: DataComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Data,
                        },
                        resolve: { [RoutingResolvers.DATASET_VIEW_DATA_KEY]: datasetDataTabResolverFn },
                    },
                    {
                        path: DatasetViewTypeEnum.Metadata,
                        component: MetadataComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Metadata,
                        },
                        resolve: { [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn },
                    },
                    {
                        path: DatasetViewTypeEnum.History,
                        component: HistoryComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.History,
                        },
                        resolve: {
                            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                        },
                    },
                    {
                        path: DatasetViewTypeEnum.Lineage,
                        component: LineageComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Lineage,
                        },
                        resolve: {
                            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                        },
                    },
                    {
                        path: DatasetViewTypeEnum.Flows,
                        component: FlowsComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Flows,
                        },
                        resolve: { [RoutingResolvers.DATASET_VIEW_FLOWS_KEY]: datasetFlowsTabResolverFn },
                        canActivate: [AuthenticatedGuard],
                    },
                    {
                        path: DatasetViewTypeEnum.Settings,
                        component: DatasetSettingsComponent,
                        runGuardsAndResolvers: "always",
                        canActivate: [AuthenticatedGuard],
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Settings,
                        },
                        resolve: {
                            [RoutingResolvers.DATASET_VIEW_SETTINGS_KEY]: datasetSettingsTabResolverFn,
                            [RoutingResolvers.DATASET_VIEW_SETTINGS_ACTIVE_SECTION_KEY]:
                                datasetSettingsActiveSectionResolverFn,
                        },
                        children: [
                            {
                                path: "",
                                redirectTo: SettingsTabsEnum.GENERAL,
                                pathMatch: "full",
                            },
                            {
                                path: SettingsTabsEnum.GENERAL,
                                component: DatasetSettingsGeneralTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.GENERAL,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_GENERAL_KEY]:
                                        datasetSettingsGeneralTabResolverFn,
                                },
                            },
                            {
                                path: SettingsTabsEnum.SCHEDULING,
                                component: DatasetSettingsSchedulingTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.SCHEDULING,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY]:
                                        datasetSettingsSchedulingTabResolverFn,
                                },
                            },
                            {
                                path: SettingsTabsEnum.INGEST_CONFIGURATION,
                                component: DatasetSettingsIngestConfigurationTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.INGEST_CONFIGURATION,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_INGEST_CONFIGURATION_KEY]:
                                        datasetSettingsIngestConfigurationResolverFn,
                                },
                            },
                            {
                                path: SettingsTabsEnum.ACCESS,
                                component: DatasetSettingsAccessTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.ACCESS,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_ACCESS_KEY]: datasetSettingsAccessTabResolverFn,
                                },
                            },
                            {
                                path: SettingsTabsEnum.TRANSFORM_SETTINGS,
                                component: DatasetSettingsTransformOptionsTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.TRANSFORM_SETTINGS,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_TRANSFORM_KEY]:
                                        datasetSettingsTransformTabResolverFn,
                                },
                            },

                            {
                                path: SettingsTabsEnum.COMPACTION,
                                component: DatasetSettingsCompactingTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.COMPACTION,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_COMPACTION_KEY]:
                                        datasetSettingsCompactionTabResolverFn,
                                },
                            },
                            {
                                path: SettingsTabsEnum.VARIABLES_AND_SECRETS,
                                component: DatasetSettingsSecretsManagerTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.VARIABLES_AND_SECRETS,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_VARIABLES_AND_SECRETS_KEY]:
                                        datasetSettingsVarAndSecretsResolverFn,
                                    [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                                },
                            },

                            {
                                path: SettingsTabsEnum.WEBHOOKS,
                                component: DatasetSettingsWebhooksTabComponent,
                                runGuardsAndResolvers: "always",
                                data: {
                                    [ProjectLinks.URL_PARAM_TAB]: SettingsTabsEnum.WEBHOOKS,
                                },
                                resolve: {
                                    [RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY]: datasetSettingsWebhooksResolverFn,
                                    [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: `:${ProjectLinks.URL_PARAM_ACCOUNT_NAME}/:${ProjectLinks.URL_PARAM_DATASET_NAME}`,
        children: [
            {
                path: `${ProjectLinks.URL_BLOCK}/:${ProjectLinks.URL_PARAM_BLOCK_HASH}`,
                component: MetadataBlockComponent,
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
                children: [
                    {
                        path: FlowDetailsTabs.HISTORY,
                        component: FlowDetailsHistoryTabComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: FlowDetailsTabs.HISTORY,
                        },
                        resolve: {
                            [RoutingResolvers.FLOW_DETAILS_HISTORY_KEY]: flowDetailsSummaryResolverFn,
                        },
                    },
                    {
                        path: FlowDetailsTabs.SUMMARY,
                        component: FlowDetailsSummaryTabComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: FlowDetailsTabs.SUMMARY,
                        },
                        resolve: {
                            [RoutingResolvers.FLOW_DETAILS_SUMMARY_KEY]: flowDetailsSummaryResolverFn,
                        },
                    },
                    {
                        path: FlowDetailsTabs.LOGS,
                        component: FlowDetailsLogsTabComponent,
                        runGuardsAndResolvers: "always",
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: FlowDetailsTabs.LOGS,
                        },
                        resolve: {
                            [RoutingResolvers.FLOW_DETAILS_LOGS_KEY]: flowDetailsSummaryResolverFn,
                        },
                    },
                    {
                        path: FlowDetailsTabs.USAGE,
                        component: FlowDetailsUsageTabComponent,
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: FlowDetailsTabs.USAGE,
                        },
                    },
                    {
                        path: FlowDetailsTabs.ADMIN,
                        component: FlowDetailsAdminTabComponent,
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: FlowDetailsTabs.ADMIN,
                        },
                    },
                ],
            },
            {
                path: "",
                canActivate: [AuthenticatedGuard],
                children: [
                    {
                        path: `${ProjectLinks.URL_PARAM_ADD_POLLING_SOURCE}`,
                        component: AddPollingSourceComponent,
                        resolve: {
                            [RoutingResolvers.ADD_POLLING_SOURCE_KEY]: addPollingSourceResolverFn,
                            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                        },
                    },
                    {
                        path: `${ProjectLinks.URL_PARAM_ADD_PUSH_SOURCE}`,
                        component: AddPushSourceComponent,
                        resolve: {
                            [RoutingResolvers.ADD_PUSH_SOURCE_KEY]: addPushSourceResolverFn,
                            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                        },
                    },
                    {
                        path: `${ProjectLinks.URL_PARAM_SET_TRANSFORM}`,
                        component: SetTransformComponent,
                        resolve: {
                            [RoutingResolvers.SET_TRANSFORM_KEY]: setTransformResolverFn,
                            [RoutingResolvers.DATASET_INFO_KEY]: datasetInfoResolverFn,
                        },
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

// @NgModule({
//     imports: [
//         RouterModule.forRoot(routes, {
//             onSameUrlNavigation: "reload",
//             bindToComponentInputs: true,
//         }),
//     ],
//     exports: [RouterModule],
// })
// export class AppRoutingModule {}
