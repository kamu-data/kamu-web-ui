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
    FlowStatus,
    FlowSummaryDataFragment,
    FlowTriggerBreakingChangeRule,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import timekeeper from "timekeeper";

import { FlowTableHelpers } from "./flows-table.helpers";
import {
    durationBlockTextResults,
    expectationsDescriptionEndOfMessage,
    expectationsDesriptionColumnOptions,
    expectationsFlowTypeDescriptions,
    mockDatasetExecuteTransformFlowSummaryData,
    mockFlowPollingSourceFragmentFetchImage,
    mockFlowPollingSourceFragmentFetchStepFilesGlob,
    mockFlowPollingSourceFragmentFetchUrl,
    mockFlowSummaryDataFragmentShowForceLink,
    mockFlowSummaryDataFragmentTooltipAndDurationText,
    mockTableFlowSummaryDataFragments,
    tooltipTextResults,
} from "./flows-table.helpers.mock";

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

    it("should check waiting block text with FlowStartConditionReactive typename", () => {
        expect(
            FlowTableHelpers.waitingBlockText({
                __typename: "FlowStartConditionReactive",
                activeBatchingRule: {
                    __typename: "FlowTriggerBatchingRuleBuffering",
                    minRecordsToAwait: 500,
                    maxBatchingInterval: {
                        every: 5,
                        unit: TimeUnit.Hours,
                    },
                },
                batchingDeadline: "2022-08-05T21:17:30.613911358+00:00",
                accumulatedRecordsCount: 100,
                watermarkModified: true,
                forBreakingChange: FlowTriggerBreakingChangeRule.Recover,
            }),
        ).toEqual("waiting for input data: 100/500");
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

    it("should check retry block text in Retrying status", () => {
        expect(FlowTableHelpers.retriesBlockText(FlowStatus.Retrying, 2, 3)).toEqual("retry attempt 2 of 3");
    });

    it("should check retry block text in Running status", () => {
        expect(FlowTableHelpers.retriesBlockText(FlowStatus.Running, 2, 3)).toEqual("retry attempt 2 of 3");
    });

    it("should check retry block text in Failed status", () => {
        expect(FlowTableHelpers.retriesBlockText(FlowStatus.Finished, 3, 3)).toEqual("failed after 3 retry attempts");
    });

    it("should check retry block text throws an error in Waiting status", () => {
        expect(() => FlowTableHelpers.retriesBlockText(FlowStatus.Waiting, 0, 3)).toThrow();
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check description column options with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.descriptionColumnTableOptions(item)).toEqual(
                expectationsDesriptionColumnOptions[index],
            );
        });
    });

    mockFlowSummaryDataFragments.forEach((item: FlowSummaryDataFragment, index: number) => {
        it(`should check flow type description with status=${item.status} and outcome=${item.outcome?.__typename}`, () => {
            expect(FlowTableHelpers.flowTypeDescription(item)).toEqual(expectationsFlowTypeDescriptions[index]);
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

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and failed recoverable outcome `, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[7])).toEqual(
            "An error occurred, see logs for more details",
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and failed unrecoverable outcome `, () => {
        expect(
            FlowTableHelpers.descriptionSubMessage({
                ...mockTableFlowSummaryDataFragments[7],
                outcome: {
                    __typename: "FlowFailedError",
                    reason: {
                        __typename: "TaskFailureReasonGeneral",
                        message: "Failed",
                        recoverable: false,
                    },
                },
            }),
        ).toEqual("An unrecoverable error occurred, see logs for more details");
    });

    it(`should check description end of message with description FlowDescriptionDatasetPollingIngest typename and cacheable source`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockFlowSummaryDataFragmentShowForceLink)).toEqual(
            `Source is uncacheable: to re-scan the data, use`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetReset typename`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[9])).toEqual(
            `All dataset history has been cleared`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetCompacting typename with nothing to do`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[10])).toEqual(`Nothing to do`);
    });

    it(`should check description end of message with description FlowDescriptionDatasetCompacting typename with compaction success`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[11])).toEqual(
            `Compacted 125 original blocks to 13 resulting blocks`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetResetToMetadata typename`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[12])).toEqual(
            `All data except metadata has been deleted. Original blocks: 125. Resulting blocks: 13.`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetCompacting typename with compaction running`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[13])).toEqual(
            `Running hard compaction`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetExecuteTransform typename with input compacted error`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[14])).toEqual(
            `Input dataset <a class="text-small text-danger">my-dataset-input</a> was hard compacted`,
        );
    });

    it(`should check description end of message with description FlowDescriptionDatasetResetToMetadata with nothing to do`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[15])).toEqual(`Nothing to do`);
    });

    it(`should check description end of message with description FlowDescriptionWebhookDeliver`, () => {
        expect(FlowTableHelpers.descriptionSubMessage(mockTableFlowSummaryDataFragments[16])).toEqual(
            `Delivered message DATASET.REF.UPDATED via subscription "Example Webhook"`,
        );

        expect(
            FlowTableHelpers.descriptionSubMessage({
                ...mockTableFlowSummaryDataFragments[16],
                description: {
                    __typename: "FlowDescriptionWebhookDeliver",
                    targetUrl: "https://example.com/webhook",
                    label: "",
                    eventType: "DATASET.REF.UPDATED",
                },
            }),
        ).toEqual(`Delivered message DATASET.REF.UPDATED to https://example.com/webhook`);
    });
});
