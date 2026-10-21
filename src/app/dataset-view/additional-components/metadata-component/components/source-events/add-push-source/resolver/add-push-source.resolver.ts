/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { DatasetKind } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { requestEditableDataset } from "src/app/dataset-view/resolvers/dataset-access.helpers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const addPushSourceResolverFn: ResolveFn<MaybeNull<string>> = (route: ActivatedRouteSnapshot) => {
    const editService = inject(EditAddPushSourceService);
    const navigationService = inject(NavigationService);

    const datasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
    } as DatasetInfo;
    const sourceName = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PUSH_SOURCE_NAME) ?? "";

    return requestEditableDataset(datasetInfo, DatasetKind.Root).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            return editService
                .getEventAsYaml(datasetInfo, sourceName)
                .pipe(
                    map((eventYaml) =>
                        eventYaml === undefined ? navigationService.pageNotFoundRedirect() : eventYaml,
                    ),
                );
        }),
    );
};
