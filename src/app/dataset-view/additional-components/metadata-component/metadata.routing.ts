/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Routes } from "@angular/router";

import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { MetadataComponent } from "src/app/dataset-view/additional-components/metadata-component/metadata.component";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { datasetMetadataTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/resolver/dataset-metadata-tab.resolver";
import { metadataActiveTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-active-tab.resolver";
import { MetadataLicenseTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-license-tab/metadata-license-tab.component";
import { metadataLicenseTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-license-tab/resolvers/metadata-license-tab.resolver";
import { MetadataPollingSourceTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/metadata-polling-source-tab.component";
import { metadataPollingSourceTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/resolvers/metadata-polling-source-tab.resolver";
import { MetadataPushSourcesTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-push-sources-tab/metadata-push-sources-tab.component";
import { metadataPushSourcesTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-push-sources-tab/resolvers/metadata-push-sources-tab.resolver";
import { MetadataSchemaTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-schema-tab/metadata-schema-tab.component";
import { metadataSchemaTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-schema-tab/resolvers/metadata-schema-tab.resolver";
import { MetadataTransformationTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-transformation-tab/metadata-transformation-tab.component";
import { metadataTransformationTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-transformation-tab/resolvers/metadata-transformation-tab.resolver";
import { MetadataWatermarkTabComponent } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-watermark-tab/metadata-watermark-tab.component";
import { metadataWatermarkTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-watermark-tab/resolvers/metadata-watermark-tab.resolver";
import ProjectLinks from "src/app/project-links";

export const METADATA_ROUTES: Routes = [
    {
        path: "",
        component: MetadataComponent,
        runGuardsAndResolvers: "always",
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
                },
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Schema,
                },
            },
            {
                path: MetadataTabs.PollingSource,
                component: MetadataPollingSourceTabComponent,
                resolve: {
                    [RoutingResolvers.METADATA_POLLING_SOURCE_TAB_KEY]: metadataPollingSourceTabResolverFn,
                },
                runGuardsAndResolvers: "always",

                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.PollingSource,
                },
            },
            {
                path: MetadataTabs.License,
                component: MetadataLicenseTabComponent,
                resolve: {
                    [RoutingResolvers.METADATA_LICENSE_TAB_KEY]: metadataLicenseTabResolverFn,
                },
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.License,
                },
            },
            {
                path: MetadataTabs.Watermark,
                component: MetadataWatermarkTabComponent,
                resolve: {
                    [RoutingResolvers.METADATA_WATERMARK_TAB_KEY]: metadataWatermarkTabResolverFn,
                },
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Watermark,
                },
            },
            {
                path: MetadataTabs.Transformation,
                component: MetadataTransformationTabComponent,
                resolve: {
                    [RoutingResolvers.METADATA_TRANSFORMATION_TAB_KEY]: metadataTransformationTabResolverFn,
                },
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Transformation,
                },
            },
            {
                path: MetadataTabs.PushSources,
                component: MetadataPushSourcesTabComponent,
                resolve: {
                    [RoutingResolvers.METADATA_PUSH_SOURCES_TAB_KEY]: metadataPushSourcesTabResolverFn,
                },
                runGuardsAndResolvers: "always",
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.PushSources,
                },
            },
        ],
    },
];
