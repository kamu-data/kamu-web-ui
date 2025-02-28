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
import { DatasetFlowTableHelpers } from "./flows-table.helpers";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import {
    durationBlockTextResults,
    expectationsDescriptionEndOfMessage,
    expectationsDesriptionColumnOptions,
    mockDatasetExecuteTransformFlowSummaryData,
    mockDatasets,
    mockFlowSummaryDataFragmentShowForceLink,
    mockFlowSummaryDataFragmentTooltipAndDurationText,
    mockTableFlowSummaryDataFragments,
    tooltipTextResults,
} from "./flows-table.helpers.mock";
import timekeeper from "timekeeper";
import { mockDatasetMainDataId } from "src/app/search/mock.data";

describe("DatasetFlowTableHelpers", () => {
    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
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
        it(`should check description column options with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(DatasetFlowTableHelpers.descriptionColumnTableOptions(item)).toEqual(
                expectationsDesriptionColumnOptions[index],
            );
        });
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check description end of message with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(DatasetFlowTableHelpers.descriptionEndOfMessage(item)).toEqual(
                expectationsDescriptionEndOfMessage[index],
            );
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check duration block text with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(DatasetFlowTableHelpers.durationBlockText(item)).toEqual(durationBlockTextResults[index]);
        });
    });

    mockFlowSummaryDataFragmentTooltipAndDurationText.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check tooltip text with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(DatasetFlowTableHelpers.tooltipText(item)).toEqual(tooltipTextResults[index]);
        });
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepUrl`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                mockDatasets,
                mockDatasets[0].id,
            ),
        ).toEqual(
            `Polling data from url: ${(mockDatasets[0].metadata.currentPollingSource?.fetch as FetchStepUrl).url}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepContainer`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                mockDatasets,
                mockDatasets[1].id,
            ),
        ).toEqual(
            `Polling data from image: ${(mockDatasets[1].metadata.currentPollingSource?.fetch as FetchStepContainer).image}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and FetchStepFilesGlob`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[0],
                mockDatasets,
                mockDatasets[2].id,
            ),
        ).toEqual(
            `Polling data from file: ${(mockDatasets[2].metadata.currentPollingSource?.fetch as FetchStepFilesGlob).path}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[4],
                mockDatasets,
                mockDatasets[3].id,
            ),
        ).toEqual(`Transforming 3 input datasets using "Apache Flink" engine`);
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and waiting status `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[3],
                mockDatasets,
                mockDatasets[2].id,
            ),
        ).toEqual(
            `Polling data from file: ${(mockDatasets[2].metadata.currentPollingSource?.fetch as FetchStepFilesGlob).path}`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename and success outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockDatasetExecuteTransformFlowSummaryData,
                mockDatasets,
                mockDatasets[3].id,
            ),
        ).toEqual(`Transformed 10 new records in 2 new blocks`);
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and success outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[5],
                mockDatasets,
                mockDatasets[3].id,
            ),
        ).toEqual("Ingested 30 new records in 4 new blocks");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and aborted outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[6],
                mockDatasets,
                mockDatasets[3].id,
            ),
        ).toContain("Aborted at");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and failed outcome `, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockTableFlowSummaryDataFragments[7],
                mockDatasets,
                mockDatasetMainDataId,
            ),
        ).toEqual("An error occurred, see logs for more details");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and cacheable source`, () => {
        expect(
            DatasetFlowTableHelpers.descriptionSubMessage(
                mockFlowSummaryDataFragmentShowForceLink,
                mockDatasets,
                mockDatasets[1].id,
            ),
        ).toEqual(`Source is uncacheable: to re-scan the data, use`);
    });
});
