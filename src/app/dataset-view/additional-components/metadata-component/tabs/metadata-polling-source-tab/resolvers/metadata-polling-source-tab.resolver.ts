/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ResolveFn } from "@angular/router";

import { DatasetKind } from "@api/kamu.graphql.interface";

import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import {
    requestMetadataTabData,
    schemaTabIfMissingAtCommit,
} from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { pageNotFoundIf } from "src/app/dataset-view/resolvers/dataset-tab-data.helpers";

export const metadataPollingSourceTabResolverFn: ResolveFn<MetadataTabData> = (route) => {
    return requestMetadataTabData(route).pipe(
        pageNotFoundIf((data) => data.datasetBasics.kind === DatasetKind.Derivative),
        schemaTabIfMissingAtCommit(route, (data) => !data.snapshot.pollingSource),
    );
};
