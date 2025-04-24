/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";
import { datasetOverviewTabResolver } from "./dataset-overview-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

export const datasetFlowsTabResolver: ResolveFn<DatasetOverviewTabData> = (route, state) => {
    return datasetOverviewTabResolver(route, state);
};
