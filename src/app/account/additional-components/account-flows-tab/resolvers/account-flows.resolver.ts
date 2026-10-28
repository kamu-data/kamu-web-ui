/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { enumValueOf } from "@common/helpers/app.helpers";
import { FlowStatus } from "@api/kamu.graphql.interface";

import {
    AccountFlowsNav,
    flowStatusGroup,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import ProjectLinks from "src/app/project-links";

export interface AccountFlowsType {
    activeNav: AccountFlowsNav;
    flowGroup: FlowStatus[];
    datasetsFiltersMode: ProcessCardFilterMode;
}

export const accountFlowsResolverFn: ResolveFn<AccountFlowsType> = (route: ActivatedRouteSnapshot) => {
    const activeNav =
        enumValueOf(AccountFlowsNav, route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV)) ??
        AccountFlowsNav.ACTIVITY;
    const currentNav = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS) ?? "";
    // Only the groups the activity tabs list can be shown, so the first known status picks its tab's group
    const firstStatus = currentNav
        .split(",")
        .map((status) => enumValueOf(FlowStatus, status))
        .find((status) => status !== undefined);
    const flowGroup = firstStatus ? flowStatusGroup(firstStatus) : [FlowStatus.Finished];
    const datasetsFiltersMode =
        enumValueOf(
            ProcessCardFilterMode,
            route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE),
        ) ?? ProcessCardFilterMode.RECENT_ACTIVITY;

    return {
        activeNav,
        flowGroup,
        datasetsFiltersMode,
    };
};
