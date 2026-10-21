/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot } from "@angular/router";

import { requireValue } from "@common/helpers/app.helpers";
import { DatasetInfo } from "@interface/navigation.interface";

import ProjectLinks from "src/app/project-links";

/** Reads the account and dataset names from the parameters of a route under a dataset URL. */
export function datasetInfoFromRoute(route: ActivatedRouteSnapshot): DatasetInfo {
    // Both parameters are mandatory in a dataset URL, so the router matches no such route without them
    return {
        accountName: requireValue(route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME)),
        datasetName: requireValue(route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME)),
    };
}
