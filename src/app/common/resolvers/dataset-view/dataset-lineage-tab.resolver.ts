/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { switchMap } from "rxjs";
import { LineageGraphUpdate } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { LineageGraphBuilderService } from "src/app/dataset-view/additional-components/lineage-component/services/lineage-graph-builder.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MaybeNull } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";

export const datasetLineageTabResolver: ResolveFn<MaybeNull<LineageGraphUpdate>> = (route: ActivatedRouteSnapshot) => {
    const lineageGraphBuilderService = inject(LineageGraphBuilderService);
    const datasetService = inject(DatasetService);
    const accountName = route.parent?.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const datasetName = route.parent?.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string;
    return datasetService
        .requestDatasetLineage({ accountName, datasetName })
        .pipe(switchMap(() => lineageGraphBuilderService.buildGraph()));
};
