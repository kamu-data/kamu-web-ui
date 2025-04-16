/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

export const activeTabResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const pathWithoutQuery = state.url.split("?")[0];
    const routeSegments = pathWithoutQuery.split("/").filter(Boolean);
    const hasAccountName = route.paramMap.has(ProjectLinks.URL_PARAM_ACCOUNT_NAME);
    const hasDatasetName = route.paramMap.has(ProjectLinks.URL_PARAM_DATASET_NAME);
    // route as example: /kamu/account.tokens.portfolio
    const isDefaultDatasetRoute = routeSegments.length === 2 && hasAccountName && hasDatasetName;
    // route as example: /kamu/account.tokens.portfolio/settings/general
    const positionFromEnd =
        routeSegments.length === 4 &&
        (routeSegments[routeSegments.length - 2] as DatasetViewTypeEnum) === DatasetViewTypeEnum.Settings
            ? 1
            : 0;

    return isDefaultDatasetRoute
        ? DatasetViewTypeEnum.Overview
        : routeSegments[routeSegments.length - 1 - positionFromEnd];
};
