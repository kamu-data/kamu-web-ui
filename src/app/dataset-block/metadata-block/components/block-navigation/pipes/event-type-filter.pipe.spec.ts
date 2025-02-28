/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EventTypeFilterPipe } from "./event-type-filter.pipe";

describe("EventTypeFilterPipe", () => {
    const pipe = new EventTypeFilterPipe();
    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should check pipe when event filter is empty", () => {
        const block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        const mockBlocks: MetadataBlockFragment[] = [block];
        const defaultEventFilter = [] as string[];

        const result: MetadataBlockFragment[] = pipe.transform(mockBlocks, defaultEventFilter);

        expect(result).toEqual(mockBlocks);
    });

    [
        { eventFilter: "ExecuteTransform", match: true },
        { eventFilter: "SetLicense", match: false },
    ].forEach(({ eventFilter, match }) => {
        it(`should check pipe when event filter is ${match ? "" : "not"}matches type of event`, () => {
            const block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
                .blockByHash as MetadataBlockFragment;
            const mockBlocks: MetadataBlockFragment[] = [block];
            const defaultEventFilter: string[] = [eventFilter];

            const result: MetadataBlockFragment[] = pipe.transform(mockBlocks, defaultEventFilter);

            expect(result).toEqual(match ? mockBlocks : []);
        });
    });

    it("should check pipe when event filter is multiple", () => {
        const mockBlocks: MetadataBlockFragment[] = mockHistoryUpdate.history;
        const defaultEventFilter = ["AddData", "SetInfo"];

        const result: MetadataBlockFragment[] = pipe.transform(mockBlocks, defaultEventFilter);

        expect(result).toEqual(mockBlocks);
    });
});
