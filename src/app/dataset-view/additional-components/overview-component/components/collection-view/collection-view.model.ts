/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryConnection } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeNullOrUndefined } from "@interface/app.types";

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
    owner: MaybeNull<AccountCollectionType>;
    contentType: MaybeNull<string>;
    extraData: object;
}

export interface AccountCollectionType {
    accountName: string;
    avatarUrl: MaybeNullOrUndefined<string>;
}

export interface CollectionEntriesResult {
    connection: CollectionEntryConnection;
    headChanged?: boolean;
}

export enum CollectionViewNode {
    File = "file",
    Dataset = "dataset",
    Folder = "folder",
    Broken = "broken",
}
