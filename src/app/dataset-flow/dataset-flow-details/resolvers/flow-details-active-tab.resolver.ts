/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { enumValueOf } from "@common/helpers/app.helpers";
import { MaybeNull } from "@interface/app.types";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import ProjectLinks from "src/app/project-links";

export const flowDetailsActiveTabResolverFn: ResolveFn<MaybeNull<FlowDetailsTabs>> = (
    route: ActivatedRouteSnapshot,
) => {
    return enumValueOf(FlowDetailsTabs, route.children[0]?.data[ProjectLinks.URL_PARAM_TAB]) ?? null;
};
