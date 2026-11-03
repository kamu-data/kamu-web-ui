/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { parseCurrentSchema, requireValue } from "@common/helpers/app.helpers";
import {
    ChainBlockPositionFragment,
    DatasetMetadataSummaryFragment,
    GetDatasetMetadataAsOfQuery,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { MetadataSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";

export function latestBlockOf(metadataSummary: DatasetMetadataSummaryFragment): ChainBlockPositionFragment {
    const { blockHash, systemTime, sequenceNumber } = requireValue(
        metadataSummary.metadata.chain.blocks.nodes.at(0),
        "Dataset has no blocks",
    );
    return { __typename: "MetadataBlockExtended", blockHash, systemTime, sequenceNumber };
}

export function latestMetadataSnapshot(metadataSummary: DatasetMetadataSummaryFragment): MetadataSnapshot {
    const metadata = metadataSummary.metadata;
    const latestBlock = latestBlockOf(metadataSummary);
    return {
        block: latestBlock,
        latestBlock,
        isLatest: true,
        schema: parseCurrentSchema(metadata.currentSchema),
        pollingSource: metadata.currentPollingSource ?? null,
        pushSources: metadata.currentPushSources,
        transform: metadata.currentTransform ?? null,
        license: metadata.currentLicense ?? null,
        watermark: metadata.currentWatermark ?? null,
    };
}

/** The snapshot as of the block the query asked for, or `null` when the chain has no such block */
export function metadataSnapshotAt(
    data: GetDatasetMetadataAsOfQuery,
    latestBlock: ChainBlockPositionFragment,
): MaybeNull<MetadataSnapshot> {
    const metadata = data.datasets.byOwnerAndName?.metadata;
    const block = metadata?.chain.blockByHash;
    if (!metadata || !block) {
        return null;
    }

    const snapshot: MetadataSnapshot = {
        block,
        latestBlock,
        // A block past the loaded latest one was committed after the page loaded, and is the newest known
        isLatest: block.sequenceNumber >= latestBlock.sequenceNumber,
        schema: null,
        pollingSource: null,
        pushSources: [],
        transform: null,
        license: null,
        watermark: metadata.currentWatermark ?? null,
    };
    for (const { event } of metadata.metadataProjection) {
        switch (event.__typename) {
            case "SetDataSchema":
                snapshot.schema = parseCurrentSchema(event.schema);
                break;
            case "SetPollingSource":
                snapshot.pollingSource = event;
                break;
            case "AddPushSource":
                snapshot.pushSources.push(event);
                break;
            case "SetTransform":
                snapshot.transform = event;
                break;
            case "SetLicense":
                snapshot.license = event;
                break;
            default:
                break;
        }
    }
    return snapshot;
}
