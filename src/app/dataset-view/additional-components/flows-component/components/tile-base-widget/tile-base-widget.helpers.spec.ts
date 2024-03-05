import { FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { TileBaseWidgetHelpers } from "./tile-base-widget.helpers";

const resultsClassName = [
    "success-class",
    "running-class",
    "waiting-class",
    "aborted-class",
    "cancelled-class",
    "failed-class",
];

describe("TileBaseWidgetHelpers", () => {
    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check set class name equal ${resultsClassName[index]}`, () => {
            expect(TileBaseWidgetHelpers.tileWidgetClass(item)).toEqual(resultsClassName[index]);
        });
    });
});
