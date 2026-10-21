/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { catchError, combineLatest, map, of, switchMap, throwError } from "rxjs";

import { DatasetNotFoundError } from "@common/values/errors";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const flowDetailsResolverFn: ResolveFn<MaybeNull<DatasetFlowByIdResponse>> = (route: ActivatedRouteSnapshot) => {
    const datasetService = inject(DatasetService);
    const datasetFlowsService = inject(DatasetFlowsService);
    const navigationService = inject(NavigationService);

    const flowId = route.paramMap.get(ProjectLinks.URL_PARAM_FLOW_ID) as string;
    const datasetInfo: DatasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string,
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME) as string,
    };

    return combineLatest([
        datasetService.requestDatasetBasicDataWithPermissions(datasetInfo),
        datasetService.datasetChanges,
    ]).pipe(
        switchMap(([, data]) =>
            datasetFlowsService.datasetFlowById({
                datasetId: data.id,
                flowId,
            }),
        ),
        map((result) => result as DatasetFlowByIdResponse),
        catchError((error: unknown) =>
            error instanceof DatasetNotFoundError
                ? of(navigationService.pageNotFoundRedirect())
                : throwError(() => error),
        ),
    );
};
