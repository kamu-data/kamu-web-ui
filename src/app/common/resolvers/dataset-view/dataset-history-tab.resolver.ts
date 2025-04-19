/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import ProjectLinks from "src/app/project-links";
import { MaybeNull } from "src/app/interface/app.types";

export const datasetHistoryTabResolver: ResolveFn<MaybeNull<DatasetHistoryUpdate>> = (
    route: ActivatedRouteSnapshot,
) => {
    const datasetService = inject(DatasetService);
    const accountName = route.parent?.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.parent?.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;
    const page = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1;

    return datasetService.getDatasetHistory({ accountName, datasetName }, 10, Number(page) - 1);
};
