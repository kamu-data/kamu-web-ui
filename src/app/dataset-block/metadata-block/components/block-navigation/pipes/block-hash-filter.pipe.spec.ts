/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";

import { BlockHashFilterPipe } from "./block-hash-filter.pipe";

describe("BlockHashFilterPipe", () => {
    const pipe = new BlockHashFilterPipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should check pipe when search filter is empty", () => {
        const block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        const mockBlocks: MetadataBlockFragment[] = [block];
        const defaultSearchFilter = "";

        const result: MetadataBlockFragment[] = pipe.transform(mockBlocks, defaultSearchFilter);

        expect(result).toEqual(mockBlocks);
    });

    [
        { searchFilter: "zW1", match: true },
        { searchFilter: "zW1qqqqqqqq", match: false },
    ].forEach(({ searchFilter, match }) => {
        it(`should check pipe when search filter is ${match ? "" : "not"}matches part of the hash`, () => {
            const block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
                .blockByHash as MetadataBlockFragment;
            const mockBlocks: MetadataBlockFragment[] = [block];
            const defaultSearchFilter = searchFilter;

            const result: MetadataBlockFragment[] = pipe.transform(mockBlocks, defaultSearchFilter);

            expect(result).toEqual(match ? mockBlocks : []);
        });
    });
});
