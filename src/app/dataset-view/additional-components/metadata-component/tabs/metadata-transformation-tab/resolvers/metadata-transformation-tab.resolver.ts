/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { DatasetKind } from "@api/kamu.graphql.interface";

import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { pageNotFoundIf, requestOverviewTabData } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";

export const metadataTransformationTabResolverFn: ResolveFn<DatasetOverviewTabData> = () => {
    return requestOverviewTabData().pipe(pageNotFoundIf((data) => data.datasetBasics.kind === DatasetKind.Root));
};
