/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AddPushSourceEventFragment,
    ChainBlockPositionFragment,
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    DatasetTransformFragment,
    LicenseFragment,
    SetPollingSourceEventFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";
import { DatasetSchema } from "@interface/dataset-schema.interface";

/** Which blocks the commit navigator steps through */
export enum CommitStepMode {
    MetadataChanges = "metadata",
    AllBlocks = "all",
}

/** The metadata the Metadata tab shows, as of one block of the chain */
export interface MetadataSnapshot {
    block: ChainBlockPositionFragment;
    latestBlock: ChainBlockPositionFragment;
    isLatest: boolean;
    schema: MaybeNull<DatasetSchema>;
    pollingSource: MaybeNull<SetPollingSourceEventFragment>;
    pushSources: AddPushSourceEventFragment[];
    transform: MaybeNull<DatasetTransformFragment>;
    license: MaybeNull<LicenseFragment>;
    watermark: MaybeNull<string>;
}

/** A block the navigator can step to; no `head` means the latest block */
export interface CommitStep {
    head?: string;
}

export interface CommitNeighbours {
    older: MaybeNull<CommitStep>;
    newer: MaybeNull<CommitStep>;
}

export interface MetadataCommitData {
    snapshot: MetadataSnapshot;
    neighbours: CommitNeighbours;
    steps: CommitStepMode;
}

export interface MetadataTabData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
    snapshot: MetadataSnapshot;
}
