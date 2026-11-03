/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { RedirectCommand, ResolveFn } from "@angular/router";

import { map, of, switchMap } from "rxjs";

import { MetadataCommitData } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import {
    commitStepModeFromRoute,
    requestMetadataTabData,
} from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { MetadataSnapshotService } from "src/app/dataset-view/additional-components/metadata-component/services/metadata-snapshot.service";

export const metadataCommitResolverFn: ResolveFn<MetadataCommitData> = (route) => {
    const metadataSnapshotService = inject(MetadataSnapshotService);

    const steps = commitStepModeFromRoute(route);
    return requestMetadataTabData(route).pipe(
        switchMap((data) => {
            if (data instanceof RedirectCommand) {
                return of(data);
            }
            const datasetInfo = {
                accountName: data.datasetBasics.owner.accountName,
                datasetName: data.datasetBasics.name,
            };
            return metadataSnapshotService
                .requestNeighbours(datasetInfo, data.snapshot, steps)
                .pipe(map((neighbours) => ({ snapshot: data.snapshot, neighbours, steps })));
        }),
    );
};
