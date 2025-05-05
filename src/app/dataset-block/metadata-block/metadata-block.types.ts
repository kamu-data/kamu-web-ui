/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

export interface MetadataBlockInfo {
    block: MetadataBlockFragment;
    blockAsYaml: string;
    downstreamsCount: number;
}
