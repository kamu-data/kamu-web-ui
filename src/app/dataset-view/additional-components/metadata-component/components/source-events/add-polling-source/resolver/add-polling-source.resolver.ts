/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { of, switchMap } from "rxjs";

import { DatasetKind } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { requestEditableDataset } from "src/app/dataset-view/resolvers/dataset-access.helpers";
import ProjectLinks from "src/app/project-links";

export const addPollingSourceResolverFn: ResolveFn<MaybeNull<string>> = (route: ActivatedRouteSnapshot) => {
    const editService = inject(EditPollingSourceService);

    const datasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
    } as DatasetInfo;

    return requestEditableDataset(datasetInfo, DatasetKind.Root).pipe(
        switchMap((data) => (data instanceof RedirectCommand ? of(data) : editService.getEventAsYaml(datasetInfo))),
    );
};
