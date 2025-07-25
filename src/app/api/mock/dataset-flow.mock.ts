/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountProvider,
    AccountType,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedQuery,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerIngestFlowMutation,
    DatasetTriggerResetFlowMutation,
    FlowConnectionDataFragment,
    FlowConnectionWidgetDataFragment,
    FlowHistoryDataFragment,
    FlowRetryBackoffType,
    FlowRetryPolicyInput,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowItemWidgetDataFragment,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsQuery,
    GetFlowByIdQuery,
    SetCompactionFlowConfigMutation,
    SetDatasetFlowTriggersMutation,
    SetIngestFlowConfigMutation,
    TaskStatus,
    DatasetTriggerTransformFlowMutation,
    DatasetTriggerCompactionFlowMutation,
    FlowTriggerScheduleRule,
} from "./../kamu.graphql.interface";
import { GetDatasetFlowConfigsQuery, DatasetKind, TimeUnit, TimeDeltaInput } from "../kamu.graphql.interface";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { mockDatasetMainDataId, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import {
    mockFlowPollingSourceFragmentFetchUrl,
    mockFlowSetTransformFragment,
} from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";

export const mockTimeDeltaInput: TimeDeltaInput = {
    every: 10,
    unit: TimeUnit.Days,
};

export const mockRetryPolicyInput: FlowRetryPolicyInput = {
    maxAttempts: 3,
    minDelay: mockTimeDeltaInput,
    backoffType: FlowRetryBackoffType.Fixed,
};

export const mockIngestGetDatasetFlowConfigsSuccess: GetDatasetFlowConfigsQuery = {
    datasets: {
        byId: {
            id: "did:odf:fed01231688285e95d02c6e2d3eaf82d3a21ba15693a1375769dd04c040193ca31718",
            kind: DatasetKind.Root,
            name: "account.transactions",
            owner: {
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                __typename: "Account",
                accountProvider: AccountProvider.Password,
            },
            alias: "account.transactions",
            visibility: mockPublicDatasetVisibility,
            __typename: "Dataset",
            flows: {
                configs: {
                    __typename: "DatasetFlowConfigs",
                    byType: {
                        rule: {
                            __typename: "FlowConfigRuleIngest",
                            fetchUncacheable: false,
                        },
                        __typename: "FlowConfiguration",
                    },
                },
                __typename: "DatasetFlows",
            },
        },
        __typename: "Datasets",
    },
};

export const mockCompactingGetDatasetFlowConfigsSuccess: GetDatasetFlowConfigsQuery = {
    datasets: {
        byId: {
            id: "did:odf:fed01231688285e95d02c6e2d3eaf82d3a21ba15693a1375769dd04c040193ca31718",
            kind: DatasetKind.Root,
            name: "account.transactions",
            owner: {
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                __typename: "Account",
                accountProvider: AccountProvider.Password,
            },
            alias: "account.transactions",
            visibility: mockPublicDatasetVisibility,
            __typename: "Dataset",
            flows: {
                configs: {
                    __typename: "DatasetFlowConfigs",
                    byType: {
                        rule: {
                            __typename: "FlowConfigRuleCompaction",
                            compactionMode: {
                                __typename: "FlowConfigCompactionModeFull",
                                maxSliceSize: 1000000,
                                maxSliceRecords: 50000,
                                recursive: false,
                            },
                        },
                        __typename: "FlowConfiguration",
                    },
                },
                __typename: "DatasetFlows",
            },
        },
        __typename: "Datasets",
    },
};

export const mockSetIngestFlowConfigMutation: SetIngestFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setIngestConfig: {
                        __typename: "SetFlowConfigSuccess",
                        message: "Success",
                    },
                },
            },
        },
    },
};

export const mockSetIngestFlowConfigMutationError: SetIngestFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setIngestConfig: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Bad dataset kind",
                        actualDatasetKind: DatasetKind.Derivative,
                        expectedDatasetKind: DatasetKind.Root,
                    },
                },
            },
        },
    },
};

export const mockSetCompactionFlowConfigMutation: SetCompactionFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setCompactionConfig: {
                        __typename: "SetFlowConfigSuccess",
                        message: "Success",
                    },
                },
            },
        },
    },
};

export const mockSetCompactionFlowConfigMutationError: SetCompactionFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setCompactionConfig: {
                        __typename: "FlowPreconditionsNotMet",
                        message: "Bad preconditions",
                        preconditions: "Some failed preconditions",
                    },
                },
            },
        },
    },
};

export const mockSetDatasetFlowTriggersSuccess: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        __typename: "SetFlowTriggerSuccess",
                        message: "Success",
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockSetDatasetFlowTriggersError: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Root,
                        actualDatasetKind: DatasetKind.Derivative,
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCronSchedule: FlowTriggerScheduleRule = {
    __typename: "Cron5ComponentExpression",
    cron5ComponentExpression: "* * * * ?",
};

export const mockGetDatasetFlowTriggersCronQuery: GetDatasetFlowTriggersQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            flows: {
                triggers: {
                    byType: {
                        paused: false,
                        schedule: mockCronSchedule,
                    },
                },
            },
        },
    },
};

export const mockGetDatasetFlowTriggersTimeDeltaQuery: GetDatasetFlowTriggersQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            flows: {
                triggers: {
                    byType: {
                        paused: true,
                        schedule: {
                            __typename: "TimeDelta",
                            every: 10,
                            unit: TimeUnit.Minutes,
                        },
                    },
                },
            },
        },
    },
};

export const mockGetDatasetFlowTriggersBatchingQuery: GetDatasetFlowTriggersQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            flows: {
                triggers: {
                    byType: {
                        paused: false,
                        batching: {
                            minRecordsToAwait: 100,
                            maxBatchingInterval: {
                                every: 10,
                                unit: TimeUnit.Hours,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const mockGetDatasetFlowTriggersDefaultBatchingQuery: GetDatasetFlowTriggersQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            flows: {
                triggers: {
                    byType: {
                        paused: true,
                        batching: {
                            minRecordsToAwait: 0,
                            maxBatchingInterval: {
                                every: 0,
                                unit: TimeUnit.Hours,
                            },
                        },
                    },
                },
            },
        },
    },
};

export const mockSetDatasetFlowTriggerSuccess: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        __typename: "SetFlowTriggerSuccess",
                        message: "Success",
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockSetDatasetFlowTriggegError: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Derivative,
                        actualDatasetKind: DatasetKind.Root,
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockFlowSummaryDataFragments: FlowSummaryDataFragment[] = [
    {
        datasetId: mockDatasetMainDataId,
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        startCondition: null,
        timing: {
            scheduledAt: "2024-02-16T09:25:00+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
            initiatedAt: "2024-02-16T09:24:59+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        description: {
            transformResult: null,
            transform: mockFlowSetTransformFragment,
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "414",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            scheduledAt: "2024-02-12T18:20:26+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
            initiatedAt: "2024-02-12T18:20:25+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        description: {
            __typename: "FlowDescriptionDatasetReset",
            resetResult: null,
        },
        flowId: "414",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        startCondition: {
            __typename: "FlowStartConditionSchedule",
            wakeUpAt: "2024-03-05T19:35:46+00:00",
        },
        timing: {
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
            initiatedAt: "2024-02-12T18:21:24+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        description: {
            __typename: "FlowDescriptionDatasetHardCompaction",
        },
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowAbortedResult",
            message: "Aborted",
        },
        startCondition: null,
        timing: {
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            initiatedAt: "2024-02-12T18:21:24+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        description: {
            __typename: "FlowDescriptionDatasetHardCompaction",
        },
        configSnapshot: {
            __typename: "FlowConfigRuleCompaction",
            compactionMode: {
                __typename: "FlowConfigCompactionModeMetadataOnly",
            },
        },
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "TaskFailureReasonGeneral",
                message: "Failed",
            },
        },
        startCondition: null,
        timing: {
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            initiatedAt: "2024-02-12T18:21:24+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: null,
        taskIds: [],
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        description: {
            ingestResult: null,
            pollingSource: mockFlowPollingSourceFragmentFetchUrl,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "414",
        status: FlowStatus.Retrying,
        initiator: null,
        outcome: null,
        timing: {
            scheduledAt: "2024-02-12T19:21:29.554197038+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
            initiatedAt: "2024-02-12T18:20:25+00:00",
            __typename: "FlowTimingRecords",
        },
        retryPolicy: {
            __typename: "FlowRetryPolicy",
            maxAttempts: 3,
        },
        taskIds: ["0", "1"],
        __typename: "Flow",
    },
];

export const mockFlowItemWidgetDataFragments: FlowItemWidgetDataFragment[] = [
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Success",
        },
        timing: {
            initiatedAt: "2024-02-16T09:24:00+00:00",
            scheduledAt: "2024-02-16T09:25:00+00:00",
            awaitingExecutorSince: "2024-02-16T09:25:01+00:00",
            runningSince: "2024-02-16T09:25:02+00:00",
            lastAttemptFinishedAt: "2024-02-16T09:25:04+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:20:25+00:00",
            scheduledAt: "2024-02-12T18:20:26+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:21:24+00:00",
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowAbortedResult",
            message: "Aborted",
        },
        timing: {
            initiatedAt: "2024-02-12T18:21:24+00:00",
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: null,
            lastAttemptFinishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "TaskFailureReasonGeneral",
                message: "Failed",
            },
        },
        timing: {
            initiatedAt: "2024-02-12T18:21:24+00:00",
            scheduledAt: "2024-02-12T18:21:25+00:00",
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27+00:00",
            lastAttemptFinishedAt: "2024-02-12T18:21:28+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        datasetId: mockDatasetMainDataId,
        flowId: "414",
        status: FlowStatus.Retrying,
        initiator: null,
        outcome: null,
        timing: {
            initiatedAt: "2024-02-12T18:21:24+00:00",
            scheduledAt: "2024-02-12T18:22:28+00:00",
            awaitingExecutorSince: null,
            runningSince: null,
            lastAttemptFinishedAt: "2024-02-12T18:21:28+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
];

export const mockDatasetPauseFlowsMutationSuccess: DatasetPauseFlowsMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    pauseFlows: true,
                },
            },
        },
    },
};

export const mockDatasetPauseFlowsMutationError: DatasetPauseFlowsMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    pauseFlows: false,
                },
            },
        },
    },
};

export const mockDatasetResumeFlowsMutationSuccess: DatasetResumeFlowsMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    resumeFlows: true,
                },
            },
        },
    },
};

export const mockDatasetResumeFlowsMutationError: DatasetResumeFlowsMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    resumeFlows: false,
                },
            },
        },
    },
};

export const mockGetDatasetListFlowsQuery: GetDatasetListFlowsQuery = {
    datasets: {
        byId: {
            id: "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
            kind: DatasetKind.Root,
            name: "test-dataset",
            owner: {
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                __typename: "Account",
                accountProvider: AccountProvider.Password,
            },
            alias: "test-dataset",
            visibility: mockPublicDatasetVisibility,
            __typename: "Dataset",
            flows: {
                runs: {
                    table: {
                        nodes: [
                            {
                                datasetId:
                                    "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                description: {
                                    ingestResult: {
                                        numBlocks: 2,
                                        numRecords: 203,
                                        updatedWatermark: "2024-08-07T00:56:35+00:00",
                                        __typename: "FlowDescriptionUpdateResultSuccess",
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
                                    scheduledAt: "2024-08-21T08:46:19.426925618+00:00",
                                    awaitingExecutorSince: "2024-08-21T08:46:19.426925618+00:00",
                                    runningSince: "2024-08-21T08:46:20.507478673+00:00",
                                    lastAttemptFinishedAt: "2024-08-21T08:46:22.636437316+00:00",
                                    initiatedAt: "2024-08-21T08:46:18.426925618+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                startCondition: null,
                                configSnapshot: {
                                    fetchUncacheable: false,
                                    __typename: "FlowConfigRuleIngest",
                                },
                                retryPolicy: null,
                                taskIds: [],
                                __typename: "Flow",
                            },
                            {
                                datasetId:
                                    "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                description: {
                                    ingestResult: null,
                                    pollingSource: mockFlowPollingSourceFragmentFetchUrl,
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                },
                                flowId: "2",
                                status: FlowStatus.Finished,
                                initiator: null,
                                outcome: {
                                    reason: {
                                        message: "FAILED",
                                        __typename: "TaskFailureReasonGeneral",
                                    },
                                    __typename: "FlowFailedError",
                                },
                                timing: {
                                    scheduledAt: "2024-08-21T08:45:17+00:00",
                                    awaitingExecutorSince: "2024-08-21T08:45:17+00:00",
                                    runningSince: "2024-08-21T08:45:18.722052534+00:00",
                                    lastAttemptFinishedAt: null,
                                    initiatedAt: "2024-08-21T08:45:16+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                startCondition: null,
                                configSnapshot: {
                                    fetchUncacheable: false,
                                    __typename: "FlowConfigRuleIngest",
                                },
                                retryPolicy: null,
                                taskIds: [],
                                __typename: "Flow",
                            },
                        ],
                        totalCount: 2,
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                            currentPage: 0,
                            totalPages: 1,
                            __typename: "PageBasedInfo",
                        },
                        __typename: "FlowConnection",
                    },
                    tiles: {
                        nodes: [
                            {
                                flowId: "0",
                                datasetId: mockDatasetMainDataId,
                                status: FlowStatus.Finished,
                                initiator: {
                                    accountName: "kamu",
                                    __typename: "Account",
                                },
                                outcome: {
                                    message: "SUCCESS",
                                    __typename: "FlowSuccessResult",
                                },
                                timing: {
                                    initiatedAt: "2024-08-21T08:46:09.426925618+00:00",
                                    scheduledAt: "2024-08-21T08:46:19.426925618+00:00",
                                    awaitingExecutorSince: "2024-08-21T08:46:19.426925618+00:00",
                                    runningSince: "2024-08-21T08:46:20.507478673+00:00",
                                    lastAttemptFinishedAt: "2024-08-21T08:46:22.636437316+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                __typename: "Flow",
                            },
                            {
                                flowId: "1",
                                datasetId: mockDatasetMainDataId,
                                status: FlowStatus.Finished,
                                initiator: null,
                                outcome: {
                                    reason: {
                                        message: "FAILED",
                                        __typename: "TaskFailureReasonGeneral",
                                    },
                                    __typename: "FlowFailedError",
                                },
                                timing: {
                                    initiatedAt: "2024-08-21T08:45:07+00:00",
                                    scheduledAt: "2024-08-21T08:45:17+00:00",
                                    awaitingExecutorSince: "2024-08-21T08:45:17+00:00",
                                    runningSince: "2024-08-21T08:45:18.722052534+00:00",
                                    lastAttemptFinishedAt: null,
                                    __typename: "FlowTimingRecords",
                                },
                                __typename: "Flow",
                            },
                        ],
                        totalCount: 2,
                        __typename: "FlowConnection",
                    },
                    __typename: "DatasetFlowRuns",
                },
                __typename: "DatasetFlows",
            },
        },
        __typename: "Datasets",
    },
};

export const mockFlowsTableData: FlowsTableData = {
    connectionDataForTable: mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.table as FlowConnectionDataFragment,
    connectionDataForWidget: mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs
        .tiles as FlowConnectionWidgetDataFragment,
    involvedDatasets: [],
};

export const mockDatasetTriggerIngestFlowMutation: DatasetTriggerIngestFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerIngestFlow: {
                        flow: {
                            configSnapshot: {
                                fetchUncacheable: true,
                                __typename: "FlowConfigRuleIngest",
                            },
                            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                            description: {
                                ingestResult: null,
                                pollingSource: mockFlowPollingSourceFragmentFetchUrl,
                                __typename: "FlowDescriptionDatasetPollingIngest",
                            },
                            flowId: "0",
                            status: FlowStatus.Waiting,
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
                            outcome: null,
                            timing: {
                                scheduledAt: "2024-02-16T09:26:00+00:00",
                                awaitingExecutorSince: "2024-02-16T09:26:04+00:00",
                                runningSince: null,
                                lastAttemptFinishedAt: null,
                                initiatedAt: "2024-02-16T09:25:59+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                        },
                        message: "Success",
                        __typename: "TriggerFlowSuccess",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerIngestFlowMutationError: DatasetTriggerIngestFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerIngestFlow: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Root,
                        actualDatasetKind: DatasetKind.Derivative,
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerTransformFlowMutation: DatasetTriggerTransformFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerTransformFlow: {
                        flow: {
                            configSnapshot: null,
                            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                            description: {
                                transform: {
                                    inputs: [],
                                    transform: {
                                        engine: "flink",
                                    },
                                },
                                transformResult: null,
                                __typename: "FlowDescriptionDatasetExecuteTransform",
                            },
                            flowId: "0",
                            status: FlowStatus.Waiting,
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
                            outcome: null,
                            timing: {
                                scheduledAt: "2024-02-16T09:26:00+00:00",
                                awaitingExecutorSince: "2024-02-16T09:26:04+00:00",
                                runningSince: null,
                                lastAttemptFinishedAt: null,
                                initiatedAt: "2024-02-16T09:25:59+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                        },
                        message: "Success",
                        __typename: "TriggerFlowSuccess",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerTransformFlowMutationError: DatasetTriggerTransformFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerTransformFlow: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Derivative,
                        actualDatasetKind: DatasetKind.Root,
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerCompactionFlowMutation: DatasetTriggerCompactionFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerCompactionFlow: {
                        flow: {
                            configSnapshot: {
                                __typename: "FlowConfigRuleCompaction",
                                compactionMode: {
                                    __typename: "FlowConfigCompactionModeFull",
                                },
                            },
                            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                            description: {
                                ingestResult: null,
                                pollingSource: mockFlowPollingSourceFragmentFetchUrl,
                                __typename: "FlowDescriptionDatasetPollingIngest",
                            },
                            flowId: "0",
                            status: FlowStatus.Waiting,
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
                            outcome: null,
                            timing: {
                                scheduledAt: "2024-02-16T09:26:00+00:00",
                                awaitingExecutorSince: "2024-02-16T09:26:04+00:00",
                                runningSince: null,
                                lastAttemptFinishedAt: null,
                                initiatedAt: "2024-02-16T09:25:59+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                        },
                        message: "Success",
                        __typename: "TriggerFlowSuccess",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerCompactionFlowMutationError: DatasetTriggerCompactionFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerCompactionFlow: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Root,
                        actualDatasetKind: DatasetKind.Derivative,
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerResetFlowMutation: DatasetTriggerResetFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerResetFlow: {
                        flow: {
                            configSnapshot: {
                                fetchUncacheable: true,
                                __typename: "FlowConfigRuleIngest",
                            },
                            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                            description: {
                                ingestResult: null,
                                pollingSource: mockFlowPollingSourceFragmentFetchUrl,
                                __typename: "FlowDescriptionDatasetPollingIngest",
                            },
                            flowId: "0",
                            status: FlowStatus.Waiting,
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
                            outcome: null,
                            timing: {
                                scheduledAt: "2024-02-16T09:26:00+00:00",
                                awaitingExecutorSince: "2024-02-16T09:26:04+00:00",
                                runningSince: null,
                                lastAttemptFinishedAt: null,
                                initiatedAt: "2024-02-16T09:25:59+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                        },
                        message: "Success",
                        __typename: "TriggerFlowSuccess",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetTriggerResetFlowMutationError: DatasetTriggerResetFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerResetFlow: {
                        __typename: "FlowPreconditionsNotMet",
                        message: "Error",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCancelScheduledTasksMutationSuccess: CancelScheduledTasksMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    cancelScheduledTasks: {
                        message: "Success",
                        flow: {
                            configSnapshot: {
                                fetchUncacheable: true,
                                __typename: "FlowConfigRuleIngest",
                            },
                            datasetId: "did:odf:fed01162400e9e5fb02d78805f48580f25589e8c3c21738999e28845f7c9d6818bec7",
                            description: {
                                ingestResult: null,
                                pollingSource: mockFlowPollingSourceFragmentFetchUrl,
                                __typename: "FlowDescriptionDatasetPollingIngest",
                            },
                            flowId: "17",
                            status: FlowStatus.Finished,
                            initiator: null,
                            outcome: {
                                __typename: "FlowAbortedResult",
                                message: "Aborted",
                            },
                            timing: {
                                scheduledAt: null,
                                awaitingExecutorSince: null,
                                runningSince: null,
                                lastAttemptFinishedAt: "2024-03-06T15:21:32.117446697+00:00",
                                initiatedAt: "2024-03-06T15:20:45+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                        },
                        __typename: "CancelScheduledTasksSuccess",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCancelScheduledTasksMutationError: CancelScheduledTasksMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    cancelScheduledTasks: {
                        __typename: "FlowNotFound",
                        flowId: "230",
                        message: "Flow '230' was not found",
                    },
                    __typename: "DatasetFlowRunsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockFlowHistoryDataFragment: FlowHistoryDataFragment[] = [
    {
        __typename: "FlowEventInitiated",
        eventId: "0",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerAutoPolling",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "1",
        eventTime: "2024-03-13T13:54:31+00:00",
        startCondition: {
            __typename: "FlowStartConditionExecutor",
            taskId: "0",
        },
    },
    {
        __typename: "FlowEventTaskChanged",
        eventId: "3",
        eventTime: "2024-03-13T13:54:32.269040795+00:00",
        taskId: "0",
        taskStatus: TaskStatus.Running,
        task: {
            outcome: null,
        },
        nextAttemptAt: null,
    },
];

export const mockDatasetFlowByIdResponse: DatasetFlowByIdResponse = {
    flow: mockFlowSummaryDataFragments[0],
    flowHistory: mockFlowHistoryDataFragment,
};

export const mockDatasetAllFlowsPausedQuery: DatasetAllFlowsPausedQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            __typename: "Dataset",
            flows: { __typename: "DatasetFlows", triggers: { __typename: "DatasetFlowTriggers", allPaused: true } },
        },
    },
};

export const mockGetFlowByIdQueryError: GetFlowByIdQuery = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    getFlow: {
                        __typename: "FlowNotFound",
                        flowId: "3",
                        message: "Error",
                    },
                },
            },
        },
    },
};

export const mockGetFlowByIdQuerySuccess: GetFlowByIdQuery = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    getFlow: {
                        flow: {
                            configSnapshot: {
                                fetchUncacheable: true,
                                __typename: "FlowConfigRuleIngest",
                            },
                            datasetId: "did:odf:fed016c0070664336545c0f49dc6a7a860c6862ab3336b630c2d7e779394a26da2e1e",
                            description: {
                                transformResult: null,
                                transform: mockFlowSetTransformFragment,
                                __typename: "FlowDescriptionDatasetExecuteTransform",
                            },
                            flowId: "595",
                            status: FlowStatus.Finished,
                            initiator: null,
                            outcome: {
                                __typename: "FlowSuccessResult",
                                message: "Success",
                            },
                            timing: {
                                scheduledAt: "2024-03-15T19:43:37.844613373+00:00",
                                awaitingExecutorSince: "2024-03-15T19:43:38+00:00",
                                runningSince: "2024-03-15T19:43:39.414651763+00:00",
                                lastAttemptFinishedAt: "2024-03-15T19:43:39.538294176+00:00",
                                initiatedAt: "2024-03-15T19:43:36.844613373+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
                            retryPolicy: null,
                            taskIds: [],
                            __typename: "Flow",
                            history: [
                                {
                                    __typename: "FlowEventInitiated",
                                    eventId: "3565",
                                    eventTime: "2024-03-15T19:43:37.844613373+00:00",
                                    trigger: {
                                        __typename: "FlowTriggerAutoPolling",
                                    },
                                },
                                {
                                    __typename: "FlowEventStartConditionUpdated",
                                    eventId: "3566",
                                    eventTime: "2024-03-15T19:43:38+00:00",
                                    startCondition: {
                                        __typename: "FlowStartConditionExecutor",
                                        taskId: "594",
                                    },
                                },
                                {
                                    __typename: "FlowEventTaskChanged",
                                    eventId: "3567",
                                    eventTime: "2024-03-15T19:43:38+00:00",
                                    taskId: "594",
                                    taskStatus: TaskStatus.Queued,
                                    task: {
                                        outcome: null,
                                    },
                                    nextAttemptAt: null,
                                },
                                {
                                    __typename: "FlowEventTaskChanged",
                                    eventId: "3568",
                                    eventTime: "2024-03-15T19:43:39.414651763+00:00",
                                    taskId: "594",
                                    taskStatus: TaskStatus.Running,
                                    task: {
                                        outcome: null,
                                    },
                                    nextAttemptAt: null,
                                },
                                {
                                    __typename: "FlowEventTaskChanged",
                                    eventId: "3569",
                                    eventTime: "2024-03-15T19:43:39.538294176+00:00",
                                    taskId: "594",
                                    taskStatus: TaskStatus.Finished,
                                    task: {
                                        outcome: {
                                            __typename: "TaskOutcomeSuccess",
                                        },
                                    },
                                    nextAttemptAt: null,
                                },
                            ],
                        },
                        __typename: "GetFlowSuccess",
                    },
                },
            },
        },
    },
};

export const mockDatasetFlowCompactionMutationSuccess: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        message: "Success",

                        __typename: "SetFlowTriggerSuccess",
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetFlowCompactionMutationError: SetDatasetFlowTriggersMutation = {
    datasets: {
        byId: {
            flows: {
                triggers: {
                    setTrigger: {
                        message: "Error",
                        reason: "Failed",
                        __typename: "FlowInvalidTriggerInputError",
                    },
                    __typename: "DatasetFlowTriggersMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetFlowsInitiatorsQuery: DatasetFlowsInitiatorsQuery = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    listFlowInitiators: {
                        totalCount: 1,
                        nodes: [
                            {
                                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                accountName: "kamu",
                                displayName: "kamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
                                accountProvider: AccountProvider.Password,
                            },
                            {
                                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                accountName: "bamu",
                                displayName: "bamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
                                accountProvider: AccountProvider.Password,
                            },
                            {
                                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                accountName: "kamu",
                                displayName: "kamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
                                accountProvider: AccountProvider.Password,
                            },
                        ],
                        __typename: "AccountConnection",
                    },
                    __typename: "DatasetFlowRuns",
                },
                __typename: "DatasetFlows",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};
