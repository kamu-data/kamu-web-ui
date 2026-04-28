/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryDataFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

export interface MoleculeExtraData {
    categories: string[];
    content_hash: string;
    content_length: number;
    content_type: string;
    description: MaybeNull<string>;
    molecule_access_level: string;
    molecule_change_by: string;
    tags: string[];
    version: number;
}

export interface CollectionEntryViewType extends CollectionEntryDataFragment {
    isFolder: boolean;
    displayName: string;
}
