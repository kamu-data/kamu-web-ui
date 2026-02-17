/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { FlowStatus } from "@api/kamu.graphql.interface";
import {
    AccountFlowsNav,
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
        (route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV) as AccountFlowsNav) ??
        AccountFlowsNav.ACTIVITY;
    const currentNav = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS);
    const flowGroup = currentNav ? (currentNav.split(",") as FlowStatus[]) : [FlowStatus.Finished];
    const datasetsFiltersMode =
        (route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_FILTERS_MODE) as ProcessCardFilterMode) ??
        ProcessCardFilterMode.RECENT_ACTIVITY;

    return {
        activeNav,
        flowGroup,
        datasetsFiltersMode,
    };
};
