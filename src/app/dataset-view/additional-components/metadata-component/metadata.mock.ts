/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockOlderBlock } from "@api/mock/dataset.mock";

import {
    mockMetadataDerivedUpdate,
    mockMetadataRootPushSourceUpdate,
    mockMetadataRootUpdate,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { latestMetadataSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata-snapshot.helpers";
import {
    CommitNeighbours,
    CommitStepMode,
    MetadataCommitData,
    MetadataSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { mockMetadataCurrentLicense } from "src/app/search/mock.data";

export const mockLatestRootSnapshot: MetadataSnapshot = latestMetadataSnapshot(mockMetadataRootUpdate.metadataSummary);
export const mockLatestRootPushSourceSnapshot: MetadataSnapshot = latestMetadataSnapshot(
    mockMetadataRootPushSourceUpdate.metadataSummary,
);
export const mockLatestDerivedSnapshot: MetadataSnapshot = latestMetadataSnapshot(
    mockMetadataDerivedUpdate.metadataSummary,
);

/** The snapshot of the same metadata, shown as of an older block */
export function atOlderCommit(snapshot: MetadataSnapshot): MetadataSnapshot {
    return { ...snapshot, block: mockOlderBlock, isLatest: false };
}

export const mockLatestRootSnapshotWithLicense: MetadataSnapshot = {
    ...mockLatestRootSnapshot,
    license: mockMetadataCurrentLicense,
};

export const mockCommitNeighbours: CommitNeighbours = {
    older: { head: mockOlderBlock.blockHash },
    newer: null,
};

export const mockLatestRootCommitData: MetadataCommitData = {
    snapshot: mockLatestRootSnapshot,
    neighbours: mockCommitNeighbours,
    steps: CommitStepMode.MetadataChanges,
};
