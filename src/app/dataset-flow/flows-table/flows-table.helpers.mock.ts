/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountProvider,
    AccountType,
    DatasetKind,
    DatasetListFlowsDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { mockDatasetMainDataId, mockPublicDatasetVisibility } from "src/app/search/mock.data";
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
];

export const expectationsDescriptionEndOfMessage = ["finished", "running", "waiting", "aborted", "failed"];

export const mockDatasetExecuteTransformFlowSummaryData: FlowSummaryDataFragment = {
    description: {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        transformResult: {
            __typename: "FlowDescriptionUpdateResultSuccess",
            numBlocks: 2,
            numRecords: 10,
        },
        __typename: "FlowDescriptionDatasetExecuteTransform",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Succes",
    },
    timing: {
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        finishedAt: null,
        __typename: "FlowTimingRecords",
    },
    __typename: "Flow",
};

export const mockDatasetExecuteTransformFlowDescriptionUpdateResultUnknown: FlowSummaryDataFragment = {
    description: {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        transformResult: {
            __typename: "FlowDescriptionUpdateResultUnknown",
            message: flowEventSubMessageResults[15],
        },
        __typename: "FlowDescriptionDatasetExecuteTransform",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Succes",
    },
    timing: {
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        finishedAt: null,
        __typename: "FlowTimingRecords",
    },
    __typename: "Flow",
};

export const mockDatasetPollingIngestFlowDescriptionUpdateResultUnknown: FlowSummaryDataFragment = {
    description: {
        datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
        ingestResult: {
            __typename: "FlowDescriptionUpdateResultUnknown",
            message: flowEventSubMessageResults[15],
        },
        __typename: "FlowDescriptionDatasetPollingIngest",
    },
    flowId: "1000",
    status: FlowStatus.Finished,
    initiator: null,
    outcome: {
        __typename: "FlowSuccessResult",
        message: "Succes",
    },
    timing: {
        awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
        runningSince: null,
        finishedAt: null,
        __typename: "FlowTimingRecords",
    },
    __typename: "Flow",
};

export const mockTableFlowSummaryDataFragments: FlowSummaryDataFragment[] = [
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            transformResult: null,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            transformResult: null,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            transformResult: {
                __typename: "FlowDescriptionUpdateResultSuccess",
                numBlocks: 2,
                numRecords: 10,
            },
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Succes",
        },
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
                __typename: "FlowDescriptionUpdateResultSuccess",
            },
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Succes",
        },
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            finishedAt: "2024-02-12T18:22:32+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
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
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: "2024-02-12T18:22:31+00:00",
            finishedAt: "2024-02-12T18:22:32+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "FlowFailureReasonGeneral",
                message: "Failed",
            },
        },
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
];

export const mockFlowSummaryDataFragmentTooltipAndDurationText: FlowSummaryDataFragment[] = [
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionExecutor",
            taskId: "10",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "416",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionSchedule",
            wakeUpAt: "2024-03-14T12:24:29+00:00",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "417",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionThrottling",
            intervalSec: 120,
            wakeUpAt: "2024-03-14T13:24:29+00:00",
            shiftedFrom: "2024-03-14T12:24:29+00:00",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "418",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: {
            __typename: "FlowStartConditionBatching",
            activeBatchingRule: {
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
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "419",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: "2024-03-14T10:34:29+00:00",
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: {
                numBlocks: 4,
                numRecords: 30,
            },
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "420",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Succes",
        },
        timing: {
            awaitingExecutorSince: "2024-03-14T10:24:29+00:00",
            runningSince: "2024-03-14T10:34:29+00:00",
            finishedAt: "2024-03-14T12:24:29+00:00",
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "421",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowAbortedResult",
            message: "Aborted",
        },
        timing: {
            awaitingExecutorSince: "2024-03-14T09:22:29+00:00",
            runningSince: null,
            finishedAt: "2024-03-14T09:24:29+00:00",
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        __typename: "Flow",
    },
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "422",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "FlowFailureReasonGeneral",
                message: "Failed",
            },
        },
        timing: {
            awaitingExecutorSince: "2024-03-14T09:22:29+00:00",
            runningSince: "2024-03-14T09:24:29+00:00",
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        startCondition: null,
        __typename: "Flow",
    },
];

export const durationBlockTextResults: string[] = [
    "waiting for 58 minutes ",
    "wake up time: in 1 hour",
    "wake up time: in 2 hours",
    "deadline time: in 1 hour",
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
    "Start running time: Mar 14th 2024 12:34:29 PM GMT+02:00",
    "Completed time: Mar 14th 2024 2:24:29 PM GMT+02:00",
    "Aborted time: Mar 14th 2024 11:24:29 AM GMT+02:00",
    "Start running time: Mar 14th 2024 11:24:29 AM GMT+02:00",
];

export const mockDatasets: DatasetListFlowsDataFragment[] = [
    {
        id: mockDatasetMainDataId,
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            __typename: "Account",
            accountProvider: AccountProvider.Password,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
        metadata: {
            currentPollingSource: {
                fetch: {
                    url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                    eventTime: null,
                    headers: null,
                    cache: null,
                    __typename: "FetchStepUrl",
                },
                __typename: "SetPollingSource",
            },
            currentTransform: null,
            __typename: "DatasetMetadata",
        },
    },
    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4101",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            __typename: "Account",
            accountProvider: AccountProvider.Password,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
        metadata: {
            currentPollingSource: {
                fetch: {
                    image: "mockImage",
                    __typename: "FetchStepContainer",
                },
                __typename: "SetPollingSource",
            },
            currentTransform: null,
            __typename: "DatasetMetadata",
        },
    },
    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4102",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            __typename: "Account",
            accountProvider: AccountProvider.Password,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
        metadata: {
            currentPollingSource: {
                fetch: {
                    path: "c:/mock-path",
                    __typename: "FetchStepFilesGlob",
                },
                __typename: "SetPollingSource",
            },
            currentTransform: null,
            __typename: "DatasetMetadata",
        },
    },

    {
        id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4103",
        kind: DatasetKind.Root,
        name: "account.tokens.transfers",
        owner: {
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            __typename: "Account",
            accountProvider: AccountProvider.Password,
        },
        alias: "account.tokens.transfers",
        visibility: mockPublicDatasetVisibility,
        __typename: "Dataset",
        metadata: {
            currentPollingSource: null,
            currentTransform: {
                inputs: [
                    {
                        __typename: "TransformInput",
                    },
                    {
                        __typename: "TransformInput",
                    },
                    {
                        __typename: "TransformInput",
                    },
                ],
                transform: {
                    engine: "flink",
                    __typename: "TransformSql",
                },
                __typename: "SetTransform",
            },
            __typename: "DatasetMetadata",
        },
    },
];

export const mockFlowSummaryDataFragmentShowForceLink: FlowSummaryDataFragment = {
    description: {
        datasetId: "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
        ingestResult: {
            uncacheable: true,
            __typename: "FlowDescriptionUpdateResultUpToDate",
        },
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
        awaitingExecutorSince: "2024-08-21T08:46:19.426925618+00:00",
        runningSince: "2024-08-21T08:46:20.507478673+00:00",
        finishedAt: "2024-08-21T08:46:22.636437316+00:00",
        __typename: "FlowTimingRecords",
    },
    startCondition: null,
    configSnapshot: {
        fetchUncacheable: false,
        __typename: "FlowConfigurationIngest",
    },
    __typename: "Flow",
};
