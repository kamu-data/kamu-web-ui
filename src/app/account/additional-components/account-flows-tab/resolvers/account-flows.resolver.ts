/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { AccountFlowsNav } from "../account-flows-tab.types";
import ProjectLinks from "src/app/project-links";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";

export interface AccountFlowsType {
    activeNav: AccountFlowsNav;
    flowGroup: FlowStatus;
}

export const accountFlowsResolverFn: ResolveFn<AccountFlowsType> = (route: ActivatedRouteSnapshot) => {
    const activeNav =
        (route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_NAV) as AccountFlowsNav) ??
        AccountFlowsNav.ACTIVITY;
    const flowGroup =
        (route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_ACCOUNT_FLOW_STATUS) as FlowStatus) ??
        FlowStatus.Finished;

    return {
        activeNav,
        flowGroup,
    };
};
