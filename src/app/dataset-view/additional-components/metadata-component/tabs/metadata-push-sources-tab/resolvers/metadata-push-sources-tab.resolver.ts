/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { DatasetKind } from "@api/kamu.graphql.interface";

import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { requestMetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { pageNotFoundIf } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";

export const metadataPushSourcesTabResolverFn: ResolveFn<MetadataTabData> = () => {
    return requestMetadataTabData().pipe(
        pageNotFoundIf(
            (data) =>
                data.datasetBasics.kind === DatasetKind.Derivative ||
                Boolean(data.metadataSummary.metadata.currentPollingSource),
        ),
    );
};
