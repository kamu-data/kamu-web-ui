/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import RoutingResolvers from "../../common/resolvers/routing-resolvers";
import { FlowDetailsTabs } from "./dataset-flow-details.types";
import { FlowDetailsAdminTabComponent } from "./tabs/flow-details-admin-tab/flow-details-admin-tab.component";
import { FlowDetailsHistoryTabComponent } from "./tabs/flow-details-history-tab/flow-details-history-tab.component";
import { FlowDetailsLogsTabComponent } from "./tabs/flow-details-logs-tab/flow-details-logs-tab.component";
import { FlowDetailsSummaryTabComponent } from "./tabs/flow-details-summary-tab/flow-details-summary-tab.component";
import { flowDetailsSummaryResolverFn } from "./tabs/flow-details-summary-tab/resolver/flow-details-summary.resolver";
import { FlowDetailsUsageTabComponent } from "./tabs/flow-details-usage-tab/flow-details-usage-tab.component";
import ProjectLinks from "../../project-links";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { flowDetailsResolverFn } from "./resolvers/flow-details.resolver";
import { flowDetailsActiveTabResolverFn } from "./resolvers/flow-details-active-tab.resolver";
import { datasetInfoResolverFn } from "src/app/common/resolvers/dataset-info.resolver";

export const FLOW_DETAILS_ROUTES: Routes = [
    {
        path: "",
        component: DatasetFlowDetailsComponent,
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
];
