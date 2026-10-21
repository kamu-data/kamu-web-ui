/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from "@angular/router";

import { of, switchMap } from "rxjs";

import { datasetInfoFromRoute } from "@common/resolvers/resolver.helpers";
import { DatasetKind } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { requestEditableDataset } from "src/app/dataset-view/resolvers/dataset-access.helpers";

export const addPollingSourceResolverFn: ResolveFn<MaybeNull<string>> = (route: ActivatedRouteSnapshot) => {
    const editService = inject(EditPollingSourceService);

    const datasetInfo = datasetInfoFromRoute(route);

    return requestEditableDataset(datasetInfo, DatasetKind.Root).pipe(
        switchMap((data) => (data instanceof RedirectCommand ? of(data) : editService.getEventAsYaml(datasetInfo))),
    );
};
