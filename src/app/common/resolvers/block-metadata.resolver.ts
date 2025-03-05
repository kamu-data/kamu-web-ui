/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { catchError, EMPTY } from "rxjs";
import { BlockService } from "src/app/dataset-block/metadata-block/block.service";
import { MetadataBlockInfo } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { MaybeUndefined } from "src/app/interface/app.types";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const blockMetadataResolver: ResolveFn<MaybeUndefined<MetadataBlockInfo>> = (route: ActivatedRouteSnapshot) => {
    const blockService = inject(BlockService);
    const navigationService = inject(NavigationService);
    const blockHash = route.paramMap.get(ProjectLinks.URL_PARAM_BLOCK_HASH) as string;
    const datasetInfo = {
        accountName: route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        datasetName: route.paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
    } as DatasetInfo;

    return blockService.requestMetadataBlock(datasetInfo, blockHash).pipe(
        catchError(() => {
            navigationService.navigateToPageNotFound();
            return EMPTY;
        }),
    );
};
