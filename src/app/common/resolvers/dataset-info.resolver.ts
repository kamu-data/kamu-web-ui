/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

import { getAllRouteParams } from "../helpers/data.helpers";

export const datasetInfoResolverFn: ResolveFn<DatasetInfo> = (route: ActivatedRouteSnapshot) => {
    const params = getAllRouteParams(route);
    const accountName = params[ProjectLinks.URL_PARAM_ACCOUNT_NAME];
    const datasetName = params[ProjectLinks.URL_PARAM_DATASET_NAME];

    return { accountName, datasetName };
};
