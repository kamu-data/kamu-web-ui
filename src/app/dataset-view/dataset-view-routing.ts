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
import { DataComponent } from "./additional-components/data-component/data.component";
import { datasetDataTabResolverFn } from "./additional-components/data-component/resolver/dataset-data-tab.resolver";
import { FlowsComponent } from "./additional-components/flows-component/flows.component";
import { datasetFlowsTabResolverFn } from "./additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { datasetMetadataTabResolverFn } from "./additional-components/metadata-component/resolver/dataset-metadata-tab.resolver";
import { datasetOverviewTabResolverFn } from "./additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import ProjectLinks from "../project-links";
import { DatasetViewComponent } from "./dataset-view.component";
import { datasetViewResolverFn } from "./resolvers/dataset-view.resolver";
import { datasetViewActiveTabResolverFn } from "./resolvers/dataset-view-active-tab.resolver";
import { OverviewComponent } from "./additional-components/overview-component/overview.component";
import { MetadataSchemaTabComponent } from "./additional-components/metadata-component/tabs/metadata-schema-tab/metadata-schema-tab.component";
import { MetadataTabs } from "./additional-components/metadata-component/metadata.constants";
import { MetadataPollingSourceTabComponent } from "./additional-components/metadata-component/tabs/metadata-polling-source-tab/metadata-polling-source-tab.component";
import { metadataActiveTabResolverFn } from "./additional-components/metadata-component/resolver/metadata-active-tab.resolver";
import { MetadataLicenseTabComponent } from "./additional-components/metadata-component/tabs/metadata-license-tab/metadata-license-tab.component";
import { MetadataWatermarkTabComponent } from "./additional-components/metadata-component/tabs/metadata-watermark-tab/metadata-watermark-tab.component";
import { MetadataTransformationTabComponent } from "./additional-components/metadata-component/tabs/metadata-transformation-tab/metadata-transformation-tab.component";
import { MetadataPushSourcesTabComponent } from "./additional-components/metadata-component/tabs/metadata-push-sources-tab/metadata-push-sources-tab.component";
import { metadataSchemaTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-schema-tab/resolvers/metadata-schema-tab.resolver";
import { metadataWatermarkTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-watermark-tab/resolvers/metadata-watermark-tab.resolver";
import { metadataTransformationTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-transformation-tab/resolvers/metadata-transformation-tab.resolver";
import { metadataLicenseTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-license-tab/resolvers/metadata-license-tab.resolver";
import { metadataPollingSourceTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-polling-source-tab/resolvers/metadata-polling-source-tab.resolver";
import { metadataPushSourcesTabResolverFn } from "./additional-components/metadata-component/tabs/metadata-push-sources-tab/resolvers/metadata-push-sources-tab.resolver";

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
                loadComponent: () =>
                    import(
                        /* webpackChunkName: "dataset-view-metadata" */
                        "./additional-components/metadata-component/metadata.component"
                    ).then((m) => m.MetadataComponent),
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Metadata,
                },
                resolve: {
                    [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                    [RoutingResolvers.DATASET_METADATA_ACTIVE_TAB_KEY]: metadataActiveTabResolverFn,
                },
                children: [
                    {
                        path: "",
                        redirectTo: MetadataTabs.Schema,
                        pathMatch: "full",
                    },
                    {
                        path: MetadataTabs.Schema,
                        component: MetadataSchemaTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_SCHEMA_TAB_KEY]: metadataSchemaTabResolverFn,
                            // [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Schema,
                        },
                    },
                    {
                        path: MetadataTabs.PollingSource,
                        component: MetadataPollingSourceTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_POLLING_SOURCE_TAB_KEY]: metadataPollingSourceTabResolverFn,
                            // [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },

                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.PollingSource,
                        },
                    },
                    {
                        path: MetadataTabs.License,
                        component: MetadataLicenseTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_LICENSE_TAB_KEY]: metadataLicenseTabResolverFn,
                            [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.License,
                        },
                    },
                    {
                        path: MetadataTabs.Watermark,
                        component: MetadataWatermarkTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_WATERMARK_TAB_KEY]: metadataWatermarkTabResolverFn,
                            [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Watermark,
                        },
                    },
                    {
                        path: MetadataTabs.Transformation,
                        component: MetadataTransformationTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_TRANSFORMATION_TAB_KEY]: metadataTransformationTabResolverFn,
                            // [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Transformation,
                        },
                    },
                    {
                        path: MetadataTabs.PushSources,
                        component: MetadataPushSourcesTabComponent,
                        resolve: {
                            [RoutingResolvers.METADATA_PUSH_SOURCES_TAB_KEY]: metadataPushSourcesTabResolverFn,
                            // [RoutingResolvers.DATASET_VIEW_METADATA_KEY]: datasetMetadataTabResolverFn,
                        },
                        data: {
                            [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.PushSources,
                        },
                    },
                ],
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
