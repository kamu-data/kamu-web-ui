/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockGetDatasetMetadataAsOfQuery, mockOlderBlock } from "@api/mock/dataset.mock";

import { mockMetadataRootPushSourceUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import {
    latestMetadataSnapshot,
    metadataSnapshotAt,
} from "src/app/dataset-view/additional-components/metadata-component/metadata-snapshot.helpers";
import { mockLatestRootSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { mockMetadataCurrentLicense } from "src/app/search/mock.data";

describe("metadata snapshot helpers", () => {
    it("should build the latest snapshot from the metadata summary", () => {
        const metadata = mockMetadataRootPushSourceUpdate.metadataSummary.metadata;

        const snapshot = latestMetadataSnapshot(mockMetadataRootPushSourceUpdate.metadataSummary);

        expect(snapshot.isLatest).toBe(true);
        expect(snapshot.block).toEqual(snapshot.latestBlock);
        expect(snapshot.block.blockHash).toEqual(metadata.chain.blocks.nodes[0].blockHash);
        expect(snapshot.pushSources).toEqual(metadata.currentPushSources);
        expect(snapshot.watermark).toEqual(metadata.currentWatermark);
    });

    it("should build the snapshot as of a block from the projected events", () => {
        const snapshot = metadataSnapshotAt(mockGetDatasetMetadataAsOfQuery, mockLatestRootSnapshot.latestBlock);

        expect(snapshot).toEqual({
            block: mockOlderBlock,
            latestBlock: mockLatestRootSnapshot.latestBlock,
            isLatest: false,
            schema: { fields: [{ name: "offset", type: { kind: "UInt64" } }] },
            pollingSource: null,
            pushSources: mockMetadataRootPushSourceUpdate.metadataSummary.metadata.currentPushSources,
            transform: null,
            license: mockMetadataCurrentLicense,
            watermark: "2022-07-30T00:00:00+00:00",
        });
    });

    it("should mark the snapshot as of the latest block as latest", () => {
        const snapshot = metadataSnapshotAt(mockGetDatasetMetadataAsOfQuery, mockOlderBlock);

        expect(snapshot?.isLatest).toBe(true);
    });

    it("should mark a block committed after the loaded latest one as latest", () => {
        const loadedLatest = {
            ...mockOlderBlock,
            blockHash: "f1620loaded",
            sequenceNumber: mockOlderBlock.sequenceNumber - 1,
        };

        const snapshot = metadataSnapshotAt(mockGetDatasetMetadataAsOfQuery, loadedLatest);

        expect(snapshot?.isLatest).toBe(true);
    });

    it("should give no snapshot for a block the chain does not have", () => {
        const unknownBlock = structuredClone(mockGetDatasetMetadataAsOfQuery);
        if (unknownBlock.datasets.byOwnerAndName) {
            unknownBlock.datasets.byOwnerAndName.metadata.chain.blockByHash = null;
        }

        expect(metadataSnapshotAt(unknownBlock, mockLatestRootSnapshot.latestBlock)).toBeNull();
    });
});
