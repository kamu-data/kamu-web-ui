/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { catchError, of } from "rxjs";

import { DatasetKind } from "@api/kamu.graphql.interface";

import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import {
    requestMetadataTabData,
    schemaTabIfMissingAtCommit,
} from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { pageNotFoundIf } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";
import { NavigationService } from "src/app/services/navigation.service";

export const metadataTransformationTabResolverFn: ResolveFn<MetadataTabData> = (route) => {
    const navigationService = inject(NavigationService);

    return requestMetadataTabData(route).pipe(
        pageNotFoundIf((data) => data.datasetBasics.kind === DatasetKind.Root),
        schemaTabIfMissingAtCommit(route, (data) => !data.snapshot.transform),
        catchError(() => of(navigationService.pageNotFoundRedirect())),
    );
};
