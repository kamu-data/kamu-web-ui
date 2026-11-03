/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { EMPTY, expand, forkJoin, map, Observable, of, reduce, switchMap, take } from "rxjs";

import { DatasetApi } from "@api/dataset.api";
import { ChainBlockPositionFragment, MetadataEventType } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

import {
    latestMetadataSnapshot,
    metadataSnapshotAt,
} from "src/app/dataset-view/additional-components/metadata-component/metadata-snapshot.helpers";
import {
    CommitNeighbours,
    CommitStep,
    CommitStepMode,
    MetadataSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";

@Injectable({
    providedIn: "root",
})
export class MetadataSnapshotService {
    public static readonly METADATA_CHANGE_EVENT_TYPES: MetadataEventType[] = [
        MetadataEventType.SetDataSchema,
        MetadataEventType.SetPollingSource,
        MetadataEventType.DisablePollingSource,
        MetadataEventType.AddPushSource,
        MetadataEventType.DisablePushSource,
        MetadataEventType.SetTransform,
        MetadataEventType.SetLicense,
    ];
    private static readonly METADATA_CHANGES_PER_PAGE = 100;

    private datasetApi = inject(DatasetApi);
    private datasetSubsService = inject(DatasetSubscriptionsService);

    /**
     * The metadata as of `head`, or the latest metadata when `head` is missing.
     * Emits `null` when the chain has no block with that hash.
     */
    public requestSnapshot(info: DatasetInfo, head: MaybeUndefined<string>): Observable<MaybeNull<MetadataSnapshot>> {
        return this.datasetSubsService.metadataSchemaChanges.pipe(
            take(1),
            switchMap(({ metadataSummary }) => {
                const latest = latestMetadataSnapshot(metadataSummary);
                if (!head || head === latest.block.blockHash) {
                    return of(latest);
                }
                return this.datasetApi
                    .getDatasetMetadataAsOf({ ...info, head })
                    .pipe(map((data) => metadataSnapshotAt(data, latest.latestBlock)));
            }),
        );
    }

    /** The blocks the navigator steps to from the snapshot's block, in the given mode */
    public requestNeighbours(
        info: DatasetInfo,
        snapshot: MetadataSnapshot,
        steps: CommitStepMode,
    ): Observable<CommitNeighbours> {
        switch (steps) {
            case CommitStepMode.MetadataChanges:
                return this.metadataChangeNeighbours(info, snapshot);
            case CommitStepMode.AllBlocks:
                return this.adjacentBlockNeighbours(info, snapshot);
        }
    }

    private metadataChangeNeighbours(info: DatasetInfo, snapshot: MetadataSnapshot): Observable<CommitNeighbours> {
        return this.requestMetadataChangeBlocks(info).pipe(
            map((blocks) => {
                // Blocks come newest first
                const sequenceNumber = snapshot.block.sequenceNumber;
                const older = blocks.find((block) => block.sequenceNumber < sequenceNumber);
                const newer = blocks.filter((block) => block.sequenceNumber > sequenceNumber).at(-1);
                return {
                    older: older ? this.stepTo(older, snapshot) : null,
                    newer: newer ? this.stepTo(newer, snapshot) : snapshot.isLatest ? null : {},
                };
            }),
        );
    }

    private adjacentBlockNeighbours(info: DatasetInfo, snapshot: MetadataSnapshot): Observable<CommitNeighbours> {
        // Pages count from the chain's head as it is now, which can be newer than the latest block the page loaded
        return this.requestBlockAt(info, 0).pipe(
            switchMap((head) => {
                const headSequenceNumber = head?.sequenceNumber ?? snapshot.latestBlock.sequenceNumber;
                // Page N of one block per page holds the block N places below the head
                const page = headSequenceNumber - snapshot.block.sequenceNumber;
                const older$ = snapshot.block.sequenceNumber > 0 ? this.requestBlockAt(info, page + 1) : of(null);
                const newer$ = page > 0 ? this.requestBlockAt(info, page - 1) : of(null);
                return forkJoin([older$, newer$]);
            }),
            map(([older, newer]) => ({
                older: older ? this.stepTo(older, snapshot) : null,
                newer: newer ? this.stepTo(newer, snapshot) : snapshot.isLatest ? null : {},
            })),
        );
    }

    private stepTo(block: ChainBlockPositionFragment, snapshot: MetadataSnapshot): CommitStep {
        return block.blockHash === snapshot.latestBlock.blockHash ? {} : { head: block.blockHash };
    }

    private requestBlockAt(info: DatasetInfo, page: number): Observable<MaybeNull<ChainBlockPositionFragment>> {
        return this.datasetApi
            .getChainBlockPositions({ ...info, page, perPage: 1 })
            .pipe(map((data) => data.datasets.byOwnerAndName?.metadata.chain.blocks.nodes.at(0) ?? null));
    }

    private requestMetadataChangeBlocks(info: DatasetInfo): Observable<ChainBlockPositionFragment[]> {
        const requestPage = (page: number) =>
            this.datasetApi
                .getChainBlockPositions({
                    ...info,
                    page,
                    perPage: MetadataSnapshotService.METADATA_CHANGES_PER_PAGE,
                    filter: { eventTypes: MetadataSnapshotService.METADATA_CHANGE_EVENT_TYPES },
                })
                .pipe(map((data) => ({ page, blocks: data.datasets.byOwnerAndName?.metadata.chain.blocks })));

        return requestPage(0).pipe(
            expand(({ page, blocks }) => (blocks?.pageInfo.hasNextPage ? requestPage(page + 1) : EMPTY)),
            reduce((all: ChainBlockPositionFragment[], { blocks }) => [...all, ...(blocks?.nodes ?? [])], []),
        );
    }
}
