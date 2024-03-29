import { FlowSummaryDataFragment, TimeUnit } from "src/app/api/kamu.graphql.interface";
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import {
    durationBlockTextResults,
    expectationsDescriptionEndOfMessage,
    expectationsDesriptionColumnOptions,
    mockDatasetExecuteTransformFlowSummaryData,
    mockFlowSummaryDataFragmentTooltipAndDurationText,
    mockTableFlowSummaryDataFragments,
    tooltipTextResults,
} from "./flows-table.helpers.mock";
import timekeeper from "timekeeper";
import moment from "moment";

describe("DatasetFlowTableHelpers", () => {
    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
        moment.relativeTimeThreshold("s", 59);
        moment.relativeTimeThreshold("m", 59);
        moment.relativeTimeThreshold("h", 23);
        moment.tz.setDefault("Europe/Kiev");
    });

    afterAll(() => {
        moment.tz.setDefault();
    });

    it("should check waiting block text with FlowStartConditionThrottling typename", () => {
        expect(
            DatasetFlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionThrottling",
                intervalSec: 120,
                wakeUpAt: "2024-03-14T18:22:29+00:00",
                shiftedFrom: "2024-02-12T18:22:29+00:00",
            }),
        ).toEqual("waiting for a throttling condition");
    });

    it("should check waiting block text with FlowStartConditionBatching typename", () => {
        expect(
            DatasetFlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionBatching",
                activeBatchingRule: {
                    minRecordsToAwait: 500,
                    maxBatchingInterval: {
                        every: 5,
                        unit: TimeUnit.Hours,
                    },
                },
                batchingDeadline: "2022-08-05T21:17:30.613911358+00:00",
                accumulatedRecordsCount: 100,
                watermarkModified: true,
            }),
        ).toEqual("waiting for a batching condition");
    });

    it("should check waiting block text with FlowStartConditionExecutor typename", () => {
        expect(
            DatasetFlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionExecutor",
                taskId: "4",
            }),
        ).toEqual("waiting for a free executor");
    });

    it("should check waiting block text with FlowStartConditionSchedule typename", () => {
        expect(
            DatasetFlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionSchedule",
                wakeUpAt: "2022-08-05T21:17:30.613911358+00:00",
            }),
        ).toEqual("waiting for scheduled execution");
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        it(`should check description column options with status=${item.status} and outcome=${item.outcome!}`, () => {
            expect(DatasetFlowTableHelpers.descriptionColumnTableOptions(item)).toEqual(
                expectationsDesriptionColumnOptions[index],
            );
        });
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        it(`should check description end of message with status=${item.status} and outcome=${item.outcome!}`, () => {
            expect(DatasetFlowTableHelpers.descriptionEndOfMessage(item)).toEqual(
                expectationsDescriptionEndOfMessage[index],
            );
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        it(`should check duration block text with status=${item.status} and outcome=${item.outcome!}`, () => {
            expect(DatasetFlowTableHelpers.durationBlockText(item)).toEqual(durationBlockTextResults[index]);
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        it(`should check tooltip text with status=${item.status} and outcome=${item.outcome!}`, () => {
            expect(DatasetFlowTableHelpers.tooltipText(item)).toEqual(tooltipTextResults[index]);
        });
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepUrl`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                { __typename: "FetchStepUrl", url: "http://test.com" },
                { numInputs: 0, engine: "" },
            ),
        ).toEqual("Polling data from url: http://test.com");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepContainer`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                { __typename: "FetchStepContainer", image: "mockImage" },
                { numInputs: 0, engine: "" },
            ),
        ).toEqual("Polling data from image: mockImage");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepFilesGlob`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                { __typename: "FetchStepFilesGlob", path: "c:/mock-path" },
                { numInputs: 0, engine: "" },
            ),
        ).toEqual("Polling data from file: c:/mock-path");
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[4], undefined, {
                numInputs: 10,
                engine: "spark",
            }),
        ).toEqual(`Transforming 10 input datasets using "Apache Spark" engine`);
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and waiting status `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[3],
                { __typename: "FetchStepFilesGlob", path: "c:/mock-path" },
                { numInputs: 0, engine: "" },
            ),
        ).toEqual("Polling data from file: c:/mock-path");
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename and success outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(mockDatasetExecuteTransformFlowSummaryData, undefined, {
                numInputs: 2,
                engine: "spark",
            }),
        ).toEqual(`Transformed 10 new records in 2 new blocks`);
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and success outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[5],
                { __typename: "FetchStepFilesGlob", path: "c:/mock-path" },
                {
                    numInputs: 0,
                    engine: "",
                },
            ),
        ).toEqual("Ingested 30 new records in 4 new blocks");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and aborted outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[6],
                { __typename: "FetchStepFilesGlob", path: "c:/mock-path" },
                {
                    numInputs: 0,
                    engine: "",
                },
            ),
        ).toContain("Aborted at");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and failed outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[7],
                { __typename: "FetchStepFilesGlob", path: "c:/mock-path" },
                {
                    numInputs: 0,
                    engine: "",
                },
            ),
        ).toEqual("An error occurred, see logs for more details");
    });
});
