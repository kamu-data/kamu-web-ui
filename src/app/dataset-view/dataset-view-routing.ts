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
import ProjectLinks from "../project-links";
import { DataComponent } from "./additional-components/data-component/data.component";
import { datasetDataTabResolverFn } from "./additional-components/data-component/resolver/dataset-data-tab.resolver";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { datasetFlowsTabResolverFn } from "./additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { datasetOverviewTabResolverFn } from "./additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetViewComponent } from "./dataset-view.component";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { datasetViewActiveTabResolverFn } from "./resolvers/dataset-view-active-tab.resolver";
import { datasetViewResolverFn } from "./resolvers/dataset-view.resolver";

export const DATASET_VIEW_ROUTES: Routes = [
    {
        path: "",
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
                component: OverviewComponent, // it's a large, but default tab, so don't load it lazily
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Overview,
                },
                resolve: { [RoutingResolvers.DATASET_VIEW_OVERVIEW_KEY]: datasetOverviewTabResolverFn },
            },
            {
                path: DatasetViewTypeEnum.Data,
                component: DataComponent, // a few kilobytes only, as components are shared with GlobalQueryComponent
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Data,
                },
                resolve: { [RoutingResolvers.DATASET_VIEW_DATA_KEY]: datasetDataTabResolverFn },
            },
            {
                path: DatasetViewTypeEnum.Metadata,
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Metadata,
                },
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "dataset-view-metadata" */
                        "./additional-components/metadata-component/metadata.routing"
                    ).then((m) => m.METADATA_ROUTES),
            },
            {
                path: DatasetViewTypeEnum.History,
                loadComponent: () =>
                    import(
                        /* webpackChunkName: "dataset-view-history" */
                        "./additional-components/history-component/history.component"
                    ).then((m) => m.HistoryComponent),
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
                    import(
                        /* webpackChunkName: "dataset-view-lineage" */
                        "./additional-components/lineage-component/lineage.component"
                    ).then((m) => m.LineageComponent),
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
                component: FlowsComponent, // potentially lazy, but for now only ~20kb
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Flows,
                },
                resolve: { [RoutingResolvers.DATASET_VIEW_FLOWS_KEY]: datasetFlowsTabResolverFn },
                canActivate: [AuthenticatedGuard],
            },
            {
                path: DatasetViewTypeEnum.Settings,
                runGuardsAndResolvers: "always",
                canActivate: [AuthenticatedGuard],
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Settings,
                },
                loadChildren: () =>
                    import(
                        /* webpackChunkName: "dataset-view-settings" */
                        "./additional-components/dataset-settings-component/dataset-settings-routing"
                    ).then((m) => m.DATASET_SETTINGS_ROUTES),
            },
        ],
    },
];
