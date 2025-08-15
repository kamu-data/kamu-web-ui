/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";
import { datasetMetadataTabResolverFn } from "../../../resolver/dataset-metadata-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

export const metadataSchemaTabResolverFn: ResolveFn<DatasetOverviewTabData> = (route, state) => {
    return datasetMetadataTabResolverFn(route, state);
};
