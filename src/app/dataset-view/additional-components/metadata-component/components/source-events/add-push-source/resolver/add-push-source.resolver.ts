/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import ProjectLinks from "src/app/project-links";

import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

export const addPushSourceResolverFn: ResolveFn<MaybeNull<string>> = (route: ActivatedRouteSnapshot) => {
    const editService = inject(EditAddPushSourceService);
    const datasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
    } as DatasetInfo;
    const sourceName = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME) ?? "";
    return editService.getEventAsYaml(datasetInfo, sourceName);
};
