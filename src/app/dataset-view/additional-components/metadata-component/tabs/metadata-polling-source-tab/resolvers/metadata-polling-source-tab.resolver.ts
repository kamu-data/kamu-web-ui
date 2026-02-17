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
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { NavigationService } from "src/app/services/navigation.service";

import { MetadataTabData } from "../../../metadata.constants";

export const metadataPollingSourceTabResolverFn: ResolveFn<MetadataTabData | null> = () => {
    const datasetService = inject(DatasetService);
    const datasetSubsService = inject(DatasetSubscriptionsService);
    const navigationService = inject(NavigationService);

    return combineLatest([
        datasetService.datasetChanges,
        datasetSubsService.permissionsChanges,
        datasetSubsService.metadataSchemaChanges.pipe(map((data: MetadataSchemaUpdate) => data.metadataSummary)),
    ]).pipe(
        map(([datasetBasics, datasetPermissions, metadataSummary]) => {
            if (datasetBasics.kind === DatasetKind.Derivative) {
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
