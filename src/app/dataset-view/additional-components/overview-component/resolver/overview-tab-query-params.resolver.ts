/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { OverviewTabQueryParamsType } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

export const overviewTabQueryParamsResolverFn: ResolveFn<OverviewTabQueryParamsType> = (
    route: ActivatedRouteSnapshot,
) => {
    const pathPrefix = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX) ?? "/";
    const version = Number(route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_VERSION)) ?? 0;
    return {
        pathPrefix,
        version,
    };
};
