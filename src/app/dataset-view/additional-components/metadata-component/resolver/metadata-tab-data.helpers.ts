/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";

import { combineLatest, map, Observable } from "rxjs";

import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

/**
 * Emits the current dataset with the user's permissions and its metadata summary. Call it from a
 * resolver.
 */
export function requestMetadataTabData(): Observable<MetadataTabData> {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubsService.permissionsChanges,
        datasetSubsService.metadataSchemaChanges,
    ]).pipe(
        map(([datasetBasics, datasetPermissions, metadataSchemaUpdate]) => ({
            datasetBasics,
            datasetPermissions,
            metadataSummary: metadataSchemaUpdate.metadataSummary,
        })),
    );
}
