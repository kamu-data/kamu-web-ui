/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

export const flowDetailsActiveTabResolverFn: ResolveFn<FlowDetailsTabs> = (route: ActivatedRouteSnapshot) => {
    return requireValue(
        enumValueOf(FlowDetailsTabs, route.children[0]?.data[ProjectLinks.URL_PARAM_TAB]),
        "Route has no FlowDetailsTabs tab",
    );
};
