/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetPermissionsService } from "src/app/dataset-view/dataset.permissions.service";
import { pageNotFoundIf, requestOverviewTabData } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";

export const datasetFlowsTabResolverFn: ResolveFn<DatasetOverviewTabData> = () => {
    const datasetPermissionsService = inject(DatasetPermissionsService);

    return requestOverviewTabData().pipe(
        pageNotFoundIf((data) => !datasetPermissionsService.shouldAllowFlowsTab(data.datasetPermissions)),
    );
};
