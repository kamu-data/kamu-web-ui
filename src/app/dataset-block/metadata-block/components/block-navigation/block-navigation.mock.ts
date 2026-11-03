/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BlockListFilter } from "src/app/dataset-block/metadata-block/metadata-block.types";
import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

export const MOCK_BLOCK_HASH_A = "f16205a3c9e1b8d0c0d7f4e2a9b6c3d8e1f0a7b4c9d2e5f8a1b6c3d0e7f4a9b2c5d8";
export const MOCK_BLOCK_HASH_B = "f1620b7e4d1a8c5f2e9b6d3a0c7f4e1b8d5a2c9f6e3b0d7a4c1f8e5b2d9a6c3f0e7";

/** A page of two blocks whose hashes have the form the API returns, so a hash prefix can match them. */
export const mockBlockListHistory: DatasetHistoryUpdate = {
    ...mockHistoryUpdate,
    history: [
        { ...mockHistoryUpdate.history[0], blockHash: MOCK_BLOCK_HASH_A },
        { ...mockHistoryUpdate.history[1], blockHash: MOCK_BLOCK_HASH_B },
    ],
};

export const MOCK_NO_BLOCK_LIST_FILTER: BlockListFilter = { eventTypes: [], hashPrefix: "" };
