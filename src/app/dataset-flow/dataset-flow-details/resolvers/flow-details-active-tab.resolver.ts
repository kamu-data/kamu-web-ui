/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

export const flowDetailsActiveTabResolverFn: ResolveFn<FlowDetailsTabs | null> = (route: ActivatedRouteSnapshot) => {
    const activeTab = route.children?.[0]?.data?.[ProjectLinks.URL_PARAM_TAB] as FlowDetailsTabs;
    return activeTab ?? null;
};
