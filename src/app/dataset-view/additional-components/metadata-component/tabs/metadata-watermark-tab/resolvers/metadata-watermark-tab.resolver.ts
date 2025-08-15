/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { map } from "rxjs";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";

export const metadataWatermarkTabResolverFn: ResolveFn<MaybeNullOrUndefined<string>> = () => {
    const datasetSubsService = inject(DatasetSubscriptionsService);
    return datasetSubsService.metadataSchemaChanges.pipe(map((data) => data.metadataSummary.metadata.currentWatermark));
};
