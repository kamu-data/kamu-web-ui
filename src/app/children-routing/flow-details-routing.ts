/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import { FlowDetailsTabs } from "../dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowDetailsAdminTabComponent } from "../dataset-flow/dataset-flow-details/tabs/flow-details-admin-tab/flow-details-admin-tab.component";
import { FlowDetailsHistoryTabComponent } from "../dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.component";
import { FlowDetailsLogsTabComponent } from "../dataset-flow/dataset-flow-details/tabs/flow-details-logs-tab/flow-details-logs-tab.component";
import { FlowDetailsSummaryTabComponent } from "../dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/flow-details-summary-tab.component";
import { flowDetailsSummaryResolverFn } from "../dataset-flow/dataset-flow-details/tabs/flow-details-summary-tab/resolver/flow-details-summary.resolver";
import { FlowDetailsUsageTabComponent } from "../dataset-flow/dataset-flow-details/tabs/flow-details-usage-tab/flow-details-usage-tab.component";
import ProjectLinks from "../project-links";

export const flowDetailsRoutes: Routes = [
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
];
