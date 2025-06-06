/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { map } from "rxjs";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { EditSetTransformService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/edit-set-transform..service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";

export const setTransformResolverFn: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
    const editService = inject(EditSetTransformService);
    const datasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
    } as DatasetInfo;
    return editService.getEventAsYaml(datasetInfo, SupportedEvents.SetTransform).pipe(map((data) => data as string));
};
