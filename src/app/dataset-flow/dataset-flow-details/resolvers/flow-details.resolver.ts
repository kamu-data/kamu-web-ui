/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { requireValue } from "@common/helpers/app.helpers";
import { datasetInfoFromRoute } from "@common/resolvers/resolver.helpers";

import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetPermissionsService } from "src/app/dataset-view/dataset.permissions.service";
import { requestDatasetWithPermissions } from "src/app/dataset-view/resolvers/dataset-access.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const flowDetailsResolverFn: ResolveFn<DatasetFlowByIdResponse> = (route: ActivatedRouteSnapshot) => {
    const datasetFlowsService = inject(DatasetFlowsService);
    const datasetPermissionsService = inject(DatasetPermissionsService);
    const navigationService = inject(NavigationService);

    const flowId = requireValue(route.paramMap.get(ProjectLinks.URL_PARAM_FLOW_ID), "Route has no flow id");
    const datasetInfo = datasetInfoFromRoute(route);

    return requestDatasetWithPermissions(datasetInfo).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            if (!datasetPermissionsService.shouldAllowFlowsTab(data.datasetPermissions)) {
                return of(navigationService.pageNotFoundRedirect());
            }
            return datasetFlowsService
                .datasetFlowById({ datasetId: data.datasetBasics.id, flowId })
                .pipe(map((result) => result ?? navigationService.pageNotFoundRedirect()));
        }),
    );
};
