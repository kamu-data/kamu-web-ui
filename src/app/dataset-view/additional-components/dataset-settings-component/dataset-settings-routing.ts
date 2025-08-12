/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { datasetInfoResolverFn } from "../../../common/resolvers/dataset-info.resolver";
import RoutingResolvers from "../../../common/resolvers/routing-resolvers";
import { SettingsTabsEnum } from "./dataset-settings.model";
import { DatasetSettingsAccessTabComponent } from "./tabs/access/dataset-settings-access-tab/dataset-settings-access-tab.component";
import { datasetSettingsAccessTabResolverFn } from "./tabs/access/dataset-settings-access-tab/resolver/dataset-settings-access-tab.resolver";
import { DatasetSettingsCompactingTabComponent } from "./tabs/compacting/dataset-settings-compacting-tab.component";
import { datasetSettingsCompactionTabResolverFn } from "./tabs/compacting/resolver/dataset-settings-compaction-tab.resolver";
import { DatasetSettingsGeneralTabComponent } from "./tabs/general/dataset-settings-general-tab.component";
import { datasetSettingsGeneralTabResolverFn } from "./tabs/general/resolver/dataset-settings-general-tab.resolver";
import { DatasetSettingsIngestConfigurationTabComponent } from "./tabs/ingest-configuration/dataset-settings-ingest-configuration-tab.component";
import { datasetSettingsIngestConfigurationResolverFn } from "./tabs/ingest-configuration/resolver/dataset-settings-ingest-configuration.resolver";
import { DatasetSettingsSchedulingTabComponent } from "./tabs/scheduling/dataset-settings-scheduling-tab.component";
import { datasetSettingsSchedulingTabResolverFn } from "./tabs/scheduling/resolver/dataset-settings-scheduling-tab.resolver";
import { DatasetSettingsTransformOptionsTabComponent } from "./tabs/transform-options/dataset-settings-transform-options-tab.component";
import { datasetSettingsTransformTabResolverFn } from "./tabs/transform-options/resolver/dataset-settings-transform-tab.resolver";
import { DatasetSettingsSecretsManagerTabComponent } from "./tabs/variables-and-secrets/dataset-settings-secrets-manager-tab.component";
import { datasetSettingsVarAndSecretsResolverFn } from "./tabs/variables-and-secrets/resolver/dataset-settings-var-and-secrets.resolver";
import { DatasetSettingsWebhooksTabComponent } from "./tabs/webhooks/dataset-settings-webhooks-tab.component";
import { datasetSettingsWebhooksResolverFn } from "./tabs/webhooks/resolver/dataset-settings-webhooks.resolver";
import ProjectLinks from "../../../project-links";
import { DatasetSettingsComponent } from "./dataset-settings.component";
import { datasetSettingsTabResolverFn } from "./resolvers/dataset-settings-tab.resolver";
import { datasetSettingsActiveSectionResolverFn } from "./resolvers/dataset-settings-active-section.resolver";

export const DATASET_SETTINGS_ROUTES: Routes = [
    {
        path: "",
        component: DatasetSettingsComponent,
        runGuardsAndResolvers: "always",
        resolve: {
            [RoutingResolvers.DATASET_VIEW_SETTINGS_KEY]: datasetSettingsTabResolverFn,
            [RoutingResolvers.DATASET_VIEW_SETTINGS_ACTIVE_SECTION_KEY]: datasetSettingsActiveSectionResolverFn,
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
                    [RoutingResolvers.DATASET_SETTINGS_GENERAL_KEY]: datasetSettingsGeneralTabResolverFn,
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
                    [RoutingResolvers.DATASET_SETTINGS_SCHEDULING_KEY]: datasetSettingsSchedulingTabResolverFn,
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
                    [RoutingResolvers.DATASET_SETTINGS_TRANSFORM_KEY]: datasetSettingsTransformTabResolverFn,
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
                    [RoutingResolvers.DATASET_SETTINGS_COMPACTION_KEY]: datasetSettingsCompactionTabResolverFn,
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
];
