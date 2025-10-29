/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";

export const rotateSecretWebhookResolverFn: ResolveFn<DatasetBasicsFragment> = () => {
    const datasetService = inject(DatasetService);
    return datasetService.datasetChanges;
};
