/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryDataFragment } from "@api/kamu.graphql.interface";

export interface LoadCollectionDataParams {
    path: string;
    page: number;
}

export interface CollectionEntryViewType extends CollectionEntryDataFragment {
    isFolder: boolean;
    displayName: string;
    systemTime: string;
    hash?: string;
    size?: number;
}
