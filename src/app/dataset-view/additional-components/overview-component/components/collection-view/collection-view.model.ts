/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountSummaryFragment, CollectionEntryConnectionDataFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export interface LoadCollectionDataParams {
    path: string;
    page: number;
    headChanged?: boolean;
    scrollActivated?: boolean;
}

export interface CollectionEntryViewType {
    nodeType: CollectionViewNode;
    displayName: string;
    alias: MaybeNull<string>;
    systemTime: string;
    hash: MaybeNull<string>;
    size: MaybeNull<number>;
    owner: MaybeNull<AccountSummaryFragment>;
    contentType: MaybeNull<string>;
    extraData: object;
}

export interface CollectionEntriesResult {
    connection: CollectionEntryConnectionDataFragment;
    headChanged?: boolean;
}

export enum CollectionViewNode {
    File = "file",
    Dataset = "dataset",
    Folder = "folder",
    Broken = "broken",
}
