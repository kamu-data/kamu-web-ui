/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { requestOverviewTabData } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";

export const datasetOverviewTabResolverFn: ResolveFn<DatasetOverviewTabData> = () => {
    return requestOverviewTabData();
};
