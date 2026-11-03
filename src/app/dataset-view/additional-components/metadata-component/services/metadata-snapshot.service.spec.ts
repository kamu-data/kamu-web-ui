/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { DatasetApi } from "@api/dataset.api";
import {
    mockBlockAt,
    mockChainBlockPositionsQuery,
    mockDatasetBlockPositionQuery,
    mockGetDatasetMetadataAsOfQuery,
    mockOlderBlock,
} from "@api/mock/dataset.mock";
import { DatasetInfo } from "@interface/navigation.interface";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockLatestRootSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import {
    CommitStepMode,
    MetadataSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { MetadataSnapshotService } from "src/app/dataset-view/additional-components/metadata-component/services/metadata-snapshot.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("MetadataSnapshotService", () => {
    const LATEST_SEQUENCE_NUMBER = 10;
    let service: MetadataSnapshotService;
    let datasetApi: DatasetApi;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [Apollo] });
        service = TestBed.inject(MetadataSnapshotService);
        datasetApi = TestBed.inject(DatasetApi);
        vi.spyOn(TestBed.inject(DatasetSubscriptionsService), "metadataSchemaChanges", "get").mockReturnValue(
            of(mockMetadataRootUpdate),
        );
    });

    /** A snapshot at the given position of a chain whose latest block is `LATEST_SEQUENCE_NUMBER` */
    function snapshotAt(sequenceNumber: number): MetadataSnapshot {
        return {
            ...mockLatestRootSnapshot,
            block: mockBlockAt(sequenceNumber),
            latestBlock: mockBlockAt(LATEST_SEQUENCE_NUMBER),
            isLatest: sequenceNumber === LATEST_SEQUENCE_NUMBER,
        };
    }

    describe("requestSnapshot", () => {
        it("should emit the latest snapshot without a request when there is no head", async () => {
            const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

            const snapshot = await firstValueFrom(service.requestSnapshot(mockDatasetInfo, undefined));

            expect(snapshot).toEqual(mockLatestRootSnapshot);
            expect(asOfSpy).not.toHaveBeenCalled();
        });

        it("should emit the latest snapshot without a request for the latest block's hash", async () => {
            const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

            const snapshot = await firstValueFrom(
                service.requestSnapshot(mockDatasetInfo, mockLatestRootSnapshot.block.blockHash),
            );

            expect(snapshot).toEqual(mockLatestRootSnapshot);
            expect(asOfSpy).not.toHaveBeenCalled();
        });

        it("should request the metadata as of an older block", async () => {
            vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(mockOlderBlock)));
            vi.spyOn(datasetApi, "getDatasetMetadataAsOf").mockReturnValue(of(mockGetDatasetMetadataAsOfQuery));

            const snapshot = await firstValueFrom(service.requestSnapshot(mockDatasetInfo, mockOlderBlock.blockHash));

            expect(snapshot?.block).toEqual(mockOlderBlock);
            expect(snapshot?.latestBlock).toEqual(mockLatestRootSnapshot.block);
            expect(snapshot?.isLatest).toBe(false);
        });

        // The backend fails the as-of fields for a block the chain does not have
        it("should emit no snapshot for a block the chain does not have, without reading as of it", async () => {
            vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(of(mockDatasetBlockPositionQuery(null)));
            const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

            const snapshot = await firstValueFrom(service.requestSnapshot(mockDatasetInfo, mockOlderBlock.blockHash));

            expect(snapshot).toBeNull();
            expect(asOfSpy).not.toHaveBeenCalled();
        });

        it("should emit no snapshot for a hash the backend cannot read", async () => {
            vi.spyOn(datasetApi, "getBlockPosition").mockReturnValue(
                throwError(() => new Error('Failed to parse "Multihash"')),
            );
            const asOfSpy = vi.spyOn(datasetApi, "getDatasetMetadataAsOf");

            const snapshot = await firstValueFrom(service.requestSnapshot(mockDatasetInfo, mockOlderBlock.blockHash));

            expect(snapshot).toBeNull();
            expect(asOfSpy).not.toHaveBeenCalled();
        });
    });

    describe("requestNeighbours in metadata changes mode", () => {
        // Metadata changes at blocks 8, 5 and 1, newest first as the API lists them
        const METADATA_CHANGES = [mockBlockAt(8), mockBlockAt(5), mockBlockAt(1)];

        function neighbours(sequenceNumber: number) {
            return firstValueFrom(
                service.requestNeighbours(mockDatasetInfo, snapshotAt(sequenceNumber), CommitStepMode.MetadataChanges),
            );
        }

        beforeEach(() => {
            vi.spyOn(datasetApi, "getChainBlockPositions").mockReturnValue(
                of(mockChainBlockPositionsQuery(METADATA_CHANGES)),
            );
        });

        it("should request the blocks of every metadata change", async () => {
            const positionsSpy = vi.spyOn(datasetApi, "getChainBlockPositions");

            await neighbours(5);

            expect(positionsSpy).toHaveBeenCalledWith({
                ...mockDatasetInfo,
                page: 0,
                perPage: 100,
                filter: { eventTypes: MetadataSnapshotService.METADATA_CHANGE_EVENT_TYPES },
            });
        });

        it("should step between the metadata changes around a metadata change", async () => {
            expect(await neighbours(5)).toEqual({
                older: { head: mockBlockAt(1).blockHash },
                newer: { head: mockBlockAt(8).blockHash },
            });
        });

        it("should step from the latest block to the newest metadata change", async () => {
            expect(await neighbours(LATEST_SEQUENCE_NUMBER)).toEqual({
                older: { head: mockBlockAt(8).blockHash },
                newer: null,
            });
        });

        it("should step from the newest metadata change back to the latest block", async () => {
            expect(await neighbours(8)).toEqual({
                older: { head: mockBlockAt(5).blockHash },
                newer: {},
            });
        });

        it("should step from a block between metadata changes to the changes around it", async () => {
            expect(await neighbours(3)).toEqual({
                older: { head: mockBlockAt(1).blockHash },
                newer: { head: mockBlockAt(5).blockHash },
            });
        });

        it("should have no older step from the oldest metadata change", async () => {
            const result = await neighbours(1);

            expect(result.older).toBeNull();
        });

        it("should read every page of metadata changes", async () => {
            const positionsSpy = vi
                .spyOn(datasetApi, "getChainBlockPositions")
                .mockReturnValueOnce(of(mockChainBlockPositionsQuery([mockBlockAt(8)], true)))
                .mockReturnValueOnce(of(mockChainBlockPositionsQuery([mockBlockAt(5)])));

            expect(await neighbours(LATEST_SEQUENCE_NUMBER)).toEqual({
                older: { head: mockBlockAt(8).blockHash },
                newer: null,
            });
            expect(await neighbours(6)).toEqual({
                older: { head: mockBlockAt(5).blockHash },
                newer: { head: mockBlockAt(8).blockHash },
            });
            expect(positionsSpy.mock.calls.map(([params]) => params.page)).toEqual([0, 1, 0]);
        });
    });

    describe("requestNeighbours in all blocks mode", () => {
        function neighbours(sequenceNumber: number) {
            return firstValueFrom(
                service.requestNeighbours(mockDatasetInfo, snapshotAt(sequenceNumber), CommitStepMode.AllBlocks),
            );
        }

        /** Answers page requests from a chain whose head is at `headSequenceNumber` */
        function chainWithHeadAt(headSequenceNumber: number) {
            // Page N of one block per page holds the block N places below the head
            return vi
                .spyOn(datasetApi, "getChainBlockPositions")
                .mockImplementation((params: DatasetInfo & { page: number }) =>
                    of(mockChainBlockPositionsQuery([mockBlockAt(headSequenceNumber - params.page)])),
                );
        }

        beforeEach(() => {
            chainWithHeadAt(LATEST_SEQUENCE_NUMBER);
        });

        it("should step to the adjacent blocks", async () => {
            expect(await neighbours(4)).toEqual({
                older: { head: mockBlockAt(3).blockHash },
                newer: { head: mockBlockAt(5).blockHash },
            });
        });

        it("should step from the block below the latest one back to the latest block", async () => {
            expect(await neighbours(LATEST_SEQUENCE_NUMBER - 1)).toEqual({
                older: { head: mockBlockAt(LATEST_SEQUENCE_NUMBER - 2).blockHash },
                newer: {},
            });
        });

        it("should have no newer step from the latest block", async () => {
            const result = await neighbours(LATEST_SEQUENCE_NUMBER);

            expect(result.newer).toBeNull();
        });

        it("should have no older step from the first block", async () => {
            const positionsSpy = chainWithHeadAt(LATEST_SEQUENCE_NUMBER);

            const result = await neighbours(0);

            expect(result.older).toBeNull();
            expect(positionsSpy.mock.calls.map(([params]) => params.page)).toEqual([0, LATEST_SEQUENCE_NUMBER - 1]);
        });

        it("should step to the adjacent blocks when the chain grew after the page loaded", async () => {
            chainWithHeadAt(LATEST_SEQUENCE_NUMBER + 2);

            expect(await neighbours(4)).toEqual({
                older: { head: mockBlockAt(3).blockHash },
                newer: { head: mockBlockAt(5).blockHash },
            });
        });

        it("should step from the loaded latest block to a block committed after the page loaded", async () => {
            chainWithHeadAt(LATEST_SEQUENCE_NUMBER + 2);

            expect(await neighbours(LATEST_SEQUENCE_NUMBER)).toEqual({
                older: { head: mockBlockAt(LATEST_SEQUENCE_NUMBER - 1).blockHash },
                newer: { head: mockBlockAt(LATEST_SEQUENCE_NUMBER + 1).blockHash },
            });
        });
    });
});
