/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import timekeeper from "timekeeper";

import { FlowHistoryDataFragment, FlowStatus } from "@api/kamu.graphql.interface";
import { mockFlowSummaryDataFragments } from "@api/mock/dataset-flow.mock";

import { DatasetFlowDetailsHelpers } from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers";
import {
    eventFlowDescriptionsResultHistoryTab,
    flowEventIconOptionsResults,
    flowEventSubMessageResults,
    flowOutcomeOptionsResults,
    mockFlowHistoryDataFragmentForDescriptions,
    mockFlowHistoryDataFragmentForIconOptions,
    mockFlowHistoryDataFragmentForSubMessages,
    mockFlowHistoryDataOutcomeOptions,
    mockFlowSummaryDataFragmentIngestResult,
    mockHistoryFragmentWithFinishedStatus,
    mockHistoryFragmentWithQueuedStatus,
} from "src/app/dataset-flow/dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers.mock";
import {
    mockDatasetExecuteTransformFlowDescriptionUpdateResultUnknown,
    mockDatasetExecuteTransformFlowSummaryData,
    mockDatasetPollingIngestFlowDescriptionUpdateResultUnknown,
} from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";

describe("DatasetFlowDetailsHelpers", () => {
    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
    });

    mockFlowHistoryDataFragmentForDescriptions.forEach((item, index) => {
        it(`should check flow event description with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventDescription(item, mockFlowSummaryDataFragments[2])).toEqual(
                eventFlowDescriptionsResultHistoryTab[index],
            );
        });
    });

    mockFlowHistoryDataFragmentForIconOptions.forEach((item, index) => {
        it(`should check flow event icon and class with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventIconOptions(item)).toEqual(flowEventIconOptionsResults[index]);
        });
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and task outcome = Success `, () => {
        expect(DatasetFlowDetailsHelpers.flowEventIconOptions(mockHistoryFragmentWithFinishedStatus)).toEqual(
            flowEventIconOptionsResults[7],
        );
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and task outcome = Failed `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions({
                ...mockHistoryFragmentWithFinishedStatus,
                task: {
                    outcome: {
                        __typename: "TaskOutcomeFailed",
                        reason: {
                            __typename: "TaskFailureReasonGeneral",
                            message: "Failed due to some reason",
                            recoverable: true,
                        },
                    },
                },
            } as FlowHistoryDataFragment),
        ).toEqual(flowEventIconOptionsResults[8]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and task outcome = Cancelled `, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventIconOptions({
                ...mockHistoryFragmentWithFinishedStatus,
                task: {
                    outcome: {
                        __typename: "TaskOutcomeCancelled",
                    },
                },
            } as FlowHistoryDataFragment),
        ).toEqual(flowEventIconOptionsResults[9]);
    });

    it(`should check flow event icon and class with typename = FlowEventTaskChanged and in queued state `, () => {
        expect(DatasetFlowDetailsHelpers.flowEventIconOptions(mockHistoryFragmentWithQueuedStatus)).toEqual(
            flowEventIconOptionsResults[10],
        );
    });

    mockFlowHistoryDataFragmentForSubMessages.forEach((item, index) => {
        it(`should check flow event submessage with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowEventSubMessage(item, mockFlowSummaryDataFragments[0])).toEqual(
                flowEventSubMessageResults[index],
            );
        });
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Failed (recoverable)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                {
                    ...mockHistoryFragmentWithFinishedStatus,
                    task: {
                        outcome: {
                            __typename: "TaskOutcomeFailed",
                            reason: {
                                __typename: "TaskFailureReasonGeneral",
                                message: "Failed due to some reason",
                                recoverable: true,
                            },
                        },
                    },
                } as FlowHistoryDataFragment,
                mockFlowSummaryDataFragments[4],
            ),
        ).toEqual(flowEventSubMessageResults[12]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Failed (unrecoverable)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                {
                    ...mockHistoryFragmentWithFinishedStatus,
                    task: {
                        outcome: {
                            __typename: "TaskOutcomeFailed",
                            reason: {
                                __typename: "TaskFailureReasonGeneral",
                                message: "Failed due to some reason",
                                recoverable: false,
                            },
                        },
                    },
                } as FlowHistoryDataFragment,
                mockFlowSummaryDataFragments[4],
            ),
        ).toEqual(flowEventSubMessageResults[18]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult=null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragments[0],
            ),
        ).toEqual(flowEventSubMessageResults[13]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ingestResult!==null)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockFlowSummaryDataFragmentIngestResult,
            ),
        ).toEqual(flowEventSubMessageResults[14]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and flow outcome = Success (ExecuteTransform)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockDatasetExecuteTransformFlowSummaryData,
            ),
        ).toEqual(flowEventSubMessageResults[15]);
    });

    it(`should check flow event submessage with typename = FlowDescriptionUpdateResultUnknown and flow outcome = Success (ExecuteTransform)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockDatasetExecuteTransformFlowDescriptionUpdateResultUnknown,
            ),
        ).toEqual(flowEventSubMessageResults[15]);
    });

    it(`should check flow event submessage with typename = FlowDescriptionUpdateResultUnknown and flow outcome = Success (FlowDescriptionDatasetPollingIngest)`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockHistoryFragmentWithFinishedStatus,
                mockDatasetPollingIngestFlowDescriptionUpdateResultUnknown,
            ),
        ).toEqual(flowEventSubMessageResults[15]);
    });

    it(`should check flow event submessage with typename = FlowEventTaskChanged and retry scheduled`, () => {
        expect(
            DatasetFlowDetailsHelpers.flowEventSubMessage(
                mockFlowHistoryDataFragmentForDescriptions[8],
                mockFlowSummaryDataFragments[5],
            ),
        ).toEqual(flowEventSubMessageResults[17]);
    });

    it(`should check don't show dynamic image`, () => {
        const expectedResult = "";
        expect(DatasetFlowDetailsHelpers.flowStatusAnimationSrc(FlowStatus.Finished)).toEqual(expectedResult);
    });

    mockFlowHistoryDataOutcomeOptions.forEach((item, index) => {
        it(`should check flow outcome options with typename = ${item.__typename}`, () => {
            expect(DatasetFlowDetailsHelpers.flowOutcomeOptions(item)).toEqual(flowOutcomeOptionsResults[index]);
        });
    });
});
