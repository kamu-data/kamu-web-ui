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
        { eventFilter: "ExecuteQuery", match: true },
        { enventFilter: "SetLicense", match: false },
    ].forEach(({ eventFilter, match }) => {
        it(`should check pipe when event filter is ${match ? "" : "not"}matches type of event`, () => {
            const block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
                .blockByHash as MetadataBlockFragment;
            const mockBlocks: MetadataBlockFragment[] = [block];
            const defaultEventFilter: string[] = [eventFilter] as string[];

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
