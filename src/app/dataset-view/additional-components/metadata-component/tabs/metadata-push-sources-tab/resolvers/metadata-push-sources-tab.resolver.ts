/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { combineLatest, map } from "rxjs";

import { DatasetKind } from "@api/kamu.graphql.interface";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { MaybeNull } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";

export const metadataPushSourcesTabResolverFn: ResolveFn<MaybeNull<MetadataTabData>> = () => {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);
    return combineLatest([
        datasetService.datasetChanges,
        datasetSubsService.permissionsChanges,
        datasetSubsService.metadataSchemaChanges.pipe(map((data: MetadataSchemaUpdate) => data.metadataSummary)),
    ]).pipe(
        map(([datasetBasics, datasetPermissions, metadataSummary]) => {
            if (datasetBasics.kind === DatasetKind.Derivative || metadataSummary.metadata.currentPollingSource) {
                navigationService.navigateToPageNotFound();
                return null;
            }
            return {
                datasetBasics,
                datasetPermissions,
                metadataSummary,
            };
        }),
    );
};
