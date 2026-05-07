/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryConnection, CollectionEntryDataFragment, DatasetArchetype } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export interface LoadCollectionDataParams {
    path: string;
    page: number;
    headChanged: boolean;
}

export interface CollectionEntryViewType extends CollectionEntryDataFragment {
    archetype: MaybeNull<DatasetArchetype>;
    displayName: string;
    systemTime: string;
    hash: MaybeNull<string>;
    size: MaybeNull<number>;
    contentType: MaybeNull<string>;
}

export interface CollectionEntriesResult {
    connection: CollectionEntryConnection;
    headChanged: boolean;
}
