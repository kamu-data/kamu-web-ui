/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountProvider,
    AccountType,
    DatasetBasicsFragment,
    DatasetKind,
    FlowStatus,
    FlowSummaryDataFragment,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import {
    mockDatasetMainDataId,
    mockOwnerFieldsWithAvatar,
    mockPublicDatasetVisibility,
} from "src/app/search/mock.data";

import { flowEventSubMessageResults } from "../dataset-flow-details/tabs/flow-details-history-tab/flow-details-history-tab.helpers.mock";

export const expectationsDesriptionColumnOptions = [
    {
        icon: "check_circle",
        class: "completed-status",
    },
    { icon: "radio_button_checked", class: "running-status" },
    { icon: "radio_button_checked", class: "waiting-status" },
    { icon: "cancel", class: "aborted-outcome" },
    { icon: "dangerous", class: "failed-status" },
    { icon: "radio_button_checked", class: "retrying-status" },
    { icon: "dangerous", class: "failed-status" },
    { icon: "radio_button_checked", class: "running-status" },
];

export const expectationsFlowTypeDescriptions = [
    "Polling ingest",
    "Execute transformation",
    "Reset to seed",
    "Hard compaction",
    "Reset to metadata only",
    "Polling ingest",
    "Push ingest",
    "Webhook message delivery",
];

export const expectationsDescriptionEndOfMessage = [
    "finished",
    "running",
    "waiting",
    "aborted",
    "failed",
    "awaiting retry",
    "failed",
    "running",
];

export const mockFlowPollingSourceFragmentFetchUrl = {
    __typename: "SetPollingSource" as const,
    fetch: {
        url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
        eventTime: null,
        headers: null,
        cache: null,
        __typename: "FetchStepUrl" as const,
    },
};

export const mockFlowPollingSourceFragmentFetchImage = {
    __typename: "SetPollingSource" as const,
    fetch: {
        image: "mockImage",
        __typename: "FetchStepContainer" as const,
    },
};

export const mockFlowPollingSourceFragmentFetchStepFilesGlob = {
    __typename: "SetPollingSource" as const,
    fetch: {
        path: "c:/mock-path",
        __typename: "FetchStepFilesGlob" as const,
    },
};

export const mockFlowSetTransformFragment = {
    __typename: "SetTransform" as const,
    inputs: [
        {
            __typename: "TransformInput" as const,
        },
        {
            __typename: "TransformInput" as const,
        },
        {
            __typename: "TransformInput" as const,
        },
    ],
    transform: {
        engine: "flink",
        __typename: "TransformSql" as const,
    },
};

export const mockDatasetExecuteTransformFlowSummaryData: FlowSummaryDataFragment = {
    datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
    description: {
        transformResult: {
            __typename: "FlowDescriptionUpdateResultSuccess",
            numBlocks: 2,
            numRecords: 10,
        },
        transform: mockFlowSetTransformFragment,
        __typename: "FlowDescriptionDatasetExecuteTransform",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Success",
    },
    timing: {
        initiatedAt: "2024-02-12T18:22:29+00:00",
        firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
        scheduledAt: "2024-02-12T18:22:30+00:00",
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        lastAttemptFinishedAt: null,
        __typename: "FlowTimingRecords",
    },
    retryPolicy: null,
    taskIds: [],
    __typename: "Flow",
};

export const mockDatasetExecuteTransformFlowDescriptionUpdateResultUnknown: FlowSummaryDataFragment = {
    datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
    description: {
        transformResult: {
            __typename: "FlowDescriptionUpdateResultUnknown",
            message: flowEventSubMessageResults[15],
        },
        transform: mockFlowSetTransformFragment,
        __typename: "FlowDescriptionDatasetExecuteTransform",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Success",
    },
    timing: {
        initiatedAt: "2024-02-12T18:22:29+00:00",
        firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
        scheduledAt: "2024-02-12T18:22:30+00:00",
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        lastAttemptFinishedAt: null,
        __typename: "FlowTimingRecords",
    },
    retryPolicy: null,
    taskIds: [],
    __typename: "Flow",
};

export const mockDatasetPollingIngestFlowDescriptionUpdateResultUnknown: FlowSummaryDataFragment = {
    datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
    description: {
        ingestResult: {
            __typename: "FlowDescriptionUpdateResultUnknown",
            message: flowEventSubMessageResults[15],
        },
        pollingSource: mockFlowPollingSourceFragmentFetchUrl,
        __typename: "FlowDescriptionDatasetPollingIngest",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Success",
    },
    timing: {
        initiatedAt: "2024-02-12T18:22:29+00:00",
        firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
        scheduledAt: "2024-02-12T18:22:30+00:00",
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        lastAttemptFinishedAt: null,
        __typename: "FlowTimingRecords",
    },
    retryPolicy: null,
    taskIds: [],
    __typename: "Flow",
};

export const mockTableFlowSummaryDataFragments: FlowSummaryDataFragment[] = [
    // 0
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 1
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            transformResult: null,
            transform: mockFlowSetTransformFragment,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 2
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            transformResult: null,
            transform: mockFlowSetTransformFragment,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 3
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchStepFilesGlob,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 4
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            transformResult: {
                __typename: "FlowDescriptionUpdateResultSuccess",
                numBlocks: 2,
                numRecords: 10,
            },
            transform: mockFlowSetTransformFragment,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 5
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
                __typename: "FlowDescriptionUpdateResultSuccess",
            },
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 6
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowAbortedResult",
            message: "Aborted",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:22:32+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 7
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "TaskFailureReasonGeneral",
                message: "Failed",
                recoverable: true,
            },
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 8
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchImage,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 9
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetReset",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 10
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetHardCompaction",
            compactionResult: {
                __typename: "FlowDescriptionReorganizationNothingToDo",
                message: "Nothing to do",
            },
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 11
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetHardCompaction",
            compactionResult: {
                __typename: "FlowDescriptionReorganizationSuccess",
                originalBlocksCount: 125,
                resultingBlocksCount: 13,
                newHead: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            },
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 12
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetResetToMetadata",
            resetToMetadataResult: {
                __typename: "FlowDescriptionReorganizationSuccess",
                originalBlocksCount: 125,
                resultingBlocksCount: 13,
                newHead: "zW1gUpztxhibmmBcpeNgXN5wrJHjkPWzWfEK5DMuSZLzs2u",
            },
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 13
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetHardCompaction",
            compactionResult: null,
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 14
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            transformResult: null,
            transform: mockFlowSetTransformFragment,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "TaskFailureReasonInputDatasetCompacted",
                message: "Input dataset was compacted",
                inputDataset: {
                    __typename: "Dataset",
                    id: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424752",
                    kind: DatasetKind.Root,
                    name: "my-dataset-input",
                    alias: "owner/my-dataset-input",
                    owner: {
                        __typename: "Account",
                        ...mockOwnerFieldsWithAvatar,
                    },
                    visibility: {
                        __typename: "PrivateDatasetVisibility",
                    },
                },
            },
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:22:33+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 15
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionDatasetResetToMetadata",
            resetToMetadataResult: {
                __typename: "FlowDescriptionReorganizationNothingToDo",
                message: "Nothing to do",
            },
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    // 16
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            __typename: "FlowDescriptionWebhookDeliver",
            targetUrl: "https://example.com/webhook",
            label: "Example Webhook",
            eventType: "DATASET.REF.UPDATED",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
];

export const mockFlowSummaryDataFragmentTooltipAndDurationText: FlowSummaryDataFragment[] = [
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionExecutor",
            taskId: "10",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "416",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionSchedule",
            wakeUpAt: "2024-03-14T12:24:29+00:00",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "417",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionThrottling",
            intervalSec: 120,
            wakeUpAt: "2024-03-14T13:24:29+00:00",
            shiftedFrom: "2024-03-14T12:24:29+00:00",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "418",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionReactive",
            activeBatchingRule: {
                __typename: "FlowTriggerBatchingRuleBuffering",
                minRecordsToAwait: 500,
                maxBatchingInterval: {
                    every: 5,
                    unit: TimeUnit.Hours,
                },
            },
            batchingDeadline: "2024-03-14T12:24:29+00:00",
            accumulatedRecordsCount: 100,
            watermarkModified: true,
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "419",
        status: FlowStatus.Retrying,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-03-14T11:44:29+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: "2024-03-14T10:34:29+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        retryPolicy: {
            __typename: "FlowRetryPolicy",
            maxAttempts: 3,
        },
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "420",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: "2024-03-14T10:34:29+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "421",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: "2024-03-14T10:34:29+00:00",
            lastAttemptFinishedAt: "2024-03-14T12:24:29+00:00",
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "422",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowAbortedResult",
            message: "Aborted",
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T09:22:29+00:00",
            runningSince: null,
            lastAttemptFinishedAt: "2024-03-14T09:24:29+00:00",
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "423",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "TaskFailureReasonGeneral",
                message: "Failed",
                recoverable: true,
            },
        },
        timing: {
            initiatedAt: "2024-02-12T18:22:29+00:00",
            firstAttemptScheduledAt: "2024-02-12T18:22:30+00:00",
            scheduledAt: "2024-02-12T18:22:30+00:00",
            awaitingExecutorSince: "2024-03-14T09:22:29+00:00",
            runningSince: "2024-03-14T09:24:29+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
];

export const durationBlockTextResults: string[] = [
    "waiting for 58 minutes ",
    "wake up time: in 1 hour",
    "wake up time: in 2 hours",
    "deadline time: in 1 hour",
    "retrying in 22 minutes",
    "running for 48 minutes ",
    "finished in 1 hour",
    "aborted 2 hours ago",
    "failed 2 hours ago",
];

export const tooltipTextResults: string[] = [
    "waiting for: Mar 14th 2024 12:24:29 PM GMT+02:00",
    "Wake up time: Mar 14th 2024 2:24:29 PM GMT+02:00",
    "Wake up time: Mar 14th 2024 3:24:29 PM GMT+02:00",
    "Deadline time: Mar 14th 2024 2:24:29 PM GMT+02:00",
    "Planned retry time: Mar 14th 2024 1:44:29 PM GMT+02:00",
    "Start running time: Mar 14th 2024 12:34:29 PM GMT+02:00",
    "Completed time: Mar 14th 2024 2:24:29 PM GMT+02:00",
    "Aborted time: Mar 14th 2024 11:24:29 AM GMT+02:00",
    "Start running time: Mar 14th 2024 11:24:29 AM GMT+02:00",
];

export const mockDatasets: DatasetBasicsFragment[] = [
    {
        id: mockDatasetMainDataId,
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            __typename: "Account",
            ...mockOwnerFieldsWithAvatar,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
    },
    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4101",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            __typename: "Account",
            ...mockOwnerFieldsWithAvatar,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
    },
    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4102",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            __typename: "Account",
            ...mockOwnerFieldsWithAvatar,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
    },

    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4103",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            __typename: "Account",
            ...mockOwnerFieldsWithAvatar,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
    },
];

export const mockFlowSummaryDataFragmentShowForceLink: FlowSummaryDataFragment = {
    datasetId: "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
    description: {
        ingestResult: {
            uncacheable: true,
            __typename: "FlowDescriptionUpdateResultUpToDate",
        },
        pollingSource: mockFlowPollingSourceFragmentFetchUrl,
        __typename: "FlowDescriptionDatasetPollingIngest",
    },
    flowId: "3",
    status: FlowStatus.Finished,
    initiator: {
        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
        accountName: "kamu",
        displayName: "kamu",
        accountType: AccountType.User,
        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
        isAdmin: true,
        __typename: "Account",
        accountProvider: AccountProvider.Password,
    },
    outcome: {
        message: "SUCCESS",
        __typename: "FlowSuccessResult",
    },
    timing: {
        initiatedAt: "2024-08-21T08:46:18.426925618+00:00",
        firstAttemptScheduledAt: "2024-08-21T08:46:19.426925618+00:00",
        scheduledAt: "2024-08-21T08:46:19.426925618+00:00",
        awaitingExecutorSince: "2024-08-21T08:46:19.426925618+00:00",
        runningSince: "2024-08-21T08:46:20.507478673+00:00",
        lastAttemptFinishedAt: "2024-08-21T08:46:22.636437316+00:00",
        __typename: "FlowTimingRecords",
    },
    startCondition: null,
    configSnapshot: {
        fetchUncacheable: false,
        fetchNextIteration: false,
        __typename: "FlowConfigRuleIngest",
    },
    retryPolicy: null,
    taskIds: [],
    __typename: "Flow",
};
