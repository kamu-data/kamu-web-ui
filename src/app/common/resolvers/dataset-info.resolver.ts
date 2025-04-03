/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

export const datasetInfoResolver: ResolveFn<DatasetInfo> = (route: ActivatedRouteSnapshot) => {
    const params = getAllRouteParams(route);
    const accountName = params[ProjectLinks.URL_PARAM_ACCOUNT_NAME];
    const datasetName = params[ProjectLinks.URL_PARAM_DATASET_NAME];

    return {
        accountName,
        datasetName,
    };
};

function getAllRouteParams(route: ActivatedRouteSnapshot): Record<string, string> {
    let params: Record<string, string> = {};
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
        params = { ...params, ...currentRoute.params };
        currentRoute = currentRoute.parent;
    }
    return params;
}
