/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    FetchStepContainer,
    FetchStepFilesGlob,
    FetchStepUrl,
    FlowSummaryDataFragment,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { FlowTableHelpers } from "./flows-table.helpers";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import {
    durationBlockTextResults,
    expectationsDescriptionEndOfMessage,
    expectationsDesriptionColumnOptions,
    mockDatasetExecuteTransformFlowSummaryData,
    mockFlowPollingSourceFragmentFetchImage,
    mockFlowPollingSourceFragmentFetchStepFilesGlob,
    mockFlowPollingSourceFragmentFetchUrl,
    mockFlowSummaryDataFragmentShowForceLink,
    mockFlowSummaryDataFragmentTooltipAndDurationText,
    mockTableFlowSummaryDataFragments,
    tooltipTextResults,
} from "./flows-table.helpers.mock";
import timekeeper from "timekeeper";

describe("FlowTableHelpers", () => {
    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
    });

    it("should check waiting block text with FlowStartConditionThrottling typename", () => {
        expect(
            FlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionThrottling",
                intervalSec: 120,
                wakeUpAt: "2024-03-14T18:22:29+00:00",
                shiftedFrom: "2024-02-12T18:22:29+00:00",
            }),
        ).toEqual("waiting for a throttling condition");
    });

    it("should check waiting block text with FlowStartConditionBatching typename", () => {
        expect(
            FlowTableHelpers.waitingBlockText({
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
            FlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionExecutor",
                taskId: "4",
            }),
        ).toEqual("waiting for a free executor");
    });

    it("should check waiting block text with FlowStartConditionSchedule typename", () => {
        expect(
            FlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionSchedule",
                wakeUpAt: "2022-08-05T21:17:30.613911358+00:00",
            }),
        ).toEqual("waiting for scheduled execution");
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check description column options with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.descriptionColumnTableOptions(item)).toEqual(
                expectationsDesriptionColumnOptions[index],
            );
        });
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check description end of message with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.descriptionEndOfMessage(item)).toEqual(expectationsDescriptionEndOfMessage[index]);
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check duration block text with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.durationBlockText(item)).toEqual(durationBlockTextResults[index]);
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check tooltip text with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.tooltipText(item)).toEqual(tooltipTextResults[index]);
        });
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepUrl`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[0])).toEqual(
            `Polling data from url: ${(mockFlowPollingSourceFragmentFetchUrl.fetch as FetchStepUrl).url}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepContainer`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[8])).toEqual(
            `Polling data from image: ${(mockFlowPollingSourceFragmentFetchImage.fetch as FetchStepContainer).image}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepFilesGlob`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[3])).toEqual(
            `Polling data from file: ${(mockFlowPollingSourceFragmentFetchStepFilesGlob.fetch as FetchStepFilesGlob).path}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[4])).toEqual(
            `Transforming 3 input datasets using "Apache Flink" engine`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and waiting status `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[3])).toEqual(
            `Polling data from file: ${(mockFlowPollingSourceFragmentFetchStepFilesGlob.fetch as FetchStepFilesGlob).path}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename and success outcome `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockDatasetExecuteTransformFlowSummaryData)).toEqual(
            `Transformed 10 new records in 2 new blocks`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and success outcome `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[5])).toEqual(
            "Ingested 30 new records in 4 new blocks",
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and aborted outcome `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[6])).toContain("Aborted at");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and failed outcome `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[7])).toEqual(
            "An error occurred, see logs for more details",
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and cacheable source`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockFlowSummaryDataFragmentShowForceLink)).toEqual(
            `Source is uncacheable: to re-scan the data, use`,
        );
    });
});
