/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

import { datasetOverviewTabResolverFn } from "../../overview-component/resolver/dataset-overview-tab.resolver";

export const datasetDataTabResolverFn: ResolveFn<DatasetOverviewTabData> = (route, state) => {
    return datasetOverviewTabResolverFn(route, state);
};
