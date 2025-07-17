/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { datasetInfoResolverFn } from "../common/resolvers/dataset-info.resolver";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import { DataComponent } from "../dataset-view/additional-components/data-component/data.component";
import { datasetDataTabResolverFn } from "../dataset-view/additional-components/data-component/resolver/dataset-data-tab.resolver";
import { DatasetSettingsComponent } from "../dataset-view/additional-components/dataset-settings-component/dataset-settings.component";
import { datasetSettingsActiveSectionResolverFn } from "../dataset-view/additional-components/dataset-settings-component/resolvers/dataset-settings-active-section.resolver";
import { datasetSettingsTabResolverFn } from "../dataset-view/additional-components/dataset-settings-component/resolvers/dataset-settings-tab.resolver";
import { FlowsComponent } from "../dataset-view/additional-components/flows-component/flows.component";
import { datasetFlowsTabResolverFn } from "../dataset-view/additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { MetadataComponent } from "../dataset-view/additional-components/metadata-component/metadata.component";
import { datasetMetadataTabResolverFn } from "../dataset-view/additional-components/metadata-component/resolver/dataset-metadata-tab.resolver";
import { datasetOverviewTabResolverFn } from "../dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import ProjectLinks from "../project-links";

export const datasetViewRoutes: Routes = [
    {
        path: DatasetViewTypeEnum.Overview,
        redirectTo: "",
        pathMatch: "full",
    },
    {
        path: "",
        loadComponent: () =>
            import("../dataset-view/additional-components/overview-component/overview.component").then(
                (m) => m.OverviewComponent,
            ),
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
        loadComponent: () =>
            import("../dataset-view/additional-components/history-component/history.component").then(
                (m) => m.HistoryComponent,
            ),
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
        loadComponent: () =>
            import("../dataset-view/additional-components/lineage-component/lineage.component").then(
                (m) => m.LineageComponent,
            ),
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
            [RoutingResolvers.DATASET_VIEW_SETTINGS_ACTIVE_SECTION_KEY]: datasetSettingsActiveSectionResolverFn,
        },
        loadChildren: () => import("../children-routing/dataset-settings-routing").then((m) => m.datasetSettingsRoutes),
    },
];
