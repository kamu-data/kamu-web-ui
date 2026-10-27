/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { FlowStatus } from "@api/kamu.graphql.interface";

import {
    AccountFlowsNav,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { accountFlowsResolverFn } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountFlowsResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should check accountFlowsResolverFn without status", async () => {
        const route = routeSnapshot({
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: AccountFlowsNav.ACTIVITY,
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: undefined,
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE]: undefined,
            },
        });
        const result = await runResolver(accountFlowsResolverFn, route);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        });
    });

    it("should check accountFlowsResolverFn with statuses", async () => {
        const route = routeSnapshot({
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: AccountFlowsNav.ACTIVITY,
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: "RUNNING,RETRYING",
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE]: undefined,
            },
        });
        const result = await runResolver(accountFlowsResolverFn, route);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Running, FlowStatus.Retrying],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        });
    });

    it("should check accountFlowsResolverFn ignores unknown query values", async () => {
        const route = routeSnapshot({
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV]: "no-such-nav",
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: "RUNNING,no-such-status",
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE]: "no-such-mode",
            },
        });
        const result = await runResolver(accountFlowsResolverFn, route);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Running],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        });
    });

    it("should check accountFlowsResolverFn falls back when no status is known", async () => {
        const route = routeSnapshot({
            queryParams: {
                [ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS]: "no-such-status",
            },
        });
        const result = await runResolver(accountFlowsResolverFn, route);

        expect(result).toEqual({
            activeNav: AccountFlowsNav.ACTIVITY,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        });
    });
});
