/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountType,
    CancelScheduledTasksMutation,
    DatasetAllFlowsPausedQuery,
    DatasetFlowsInitiatorsQuery,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    FlowHistoryDataFragment,
    FlowOutcomeDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    GetDatasetFlowTriggersQuery,
    GetDatasetListFlowsQuery,
    GetFlowByIdQuery,
    SetDatasetFlowConfigMutation,
    SetDatasetFlowTriggersMutation,
    TaskStatus,
} from "./../kamu.graphql.interface";
import { GetDatasetFlowConfigsQuery, DatasetKind, TimeUnit, TimeDeltaInput } from "../kamu.graphql.interface";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { mockDatasetMainDataId, mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";

export const mockTimeDeltaInput: TimeDeltaInput = {
    every: 10,
    unit: TimeUnit.Days,
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
            },
            alias: "account.transactions",
            visibility: mockPublicDatasetVisibility,
            __typename: "Dataset",
            flows: {
                configs: {
                    __typename: "DatasetFlowConfigs",
                    byType: {
                        ingest: {
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

export const mockSetDatasetFlowConfigMutation: SetDatasetFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfig: {
                        __typename: "SetFlowConfigSuccess",
                        message: "Success",
                    },
                },
            },
        },
    },
};

export const mockSetDatasetFlowConfigMutationError: SetDatasetFlowConfigMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfig: {
                        __typename: "FlowTypeIsNotSupported",
                        message: "Error flow type is not supported",
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

export const mockGetDatasetFlowTriggersQuery: GetDatasetFlowTriggersQuery = {
    datasets: {
        __typename: "Datasets",
        byId: {
            flows: {
                triggers: {
                    byType: {
                        paused: true,
                        schedule: {
                            __typename: "Cron5ComponentExpression",
                            cron5ComponentExpression: "* * * * ?",
                        },
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
                        paused: true,
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
        description: {
            datasetId: mockDatasetMainDataId,
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowSuccessResult",
            message: "Succes",
        },
        startCondition: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: mockDatasetMainDataId,
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "414",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: mockDatasetMainDataId,
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
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
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: mockDatasetMainDataId,
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
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
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
    {
        description: {
            datasetId: mockDatasetMainDataId,
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: {
            __typename: "FlowFailedError",
            reason: {
                __typename: "FlowFailureReasonGeneral",
                message: "Failed",
            },
        },
        startCondition: null,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
            runningSince: null,
            finishedAt: null,
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
            },
            alias: "test-dataset",
            visibility: mockPublicDatasetVisibility,
            __typename: "Dataset",
            metadata: {
                currentPollingSource: {
                    fetch: {
                        url: "https://api.etherscan.io/api?module=account&action=txlist&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
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
            flows: {
                runs: {
                    table: {
                        nodes: [
                            {
                                description: {
                                    datasetId:
                                        "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                    ingestResult: {
                                        numBlocks: 2,
                                        numRecords: 203,
                                        updatedWatermark: "2024-08-07T00:56:35+00:00",
                                        __typename: "FlowDescriptionUpdateResultSuccess",
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
                            },
                            {
                                description: {
                                    datasetId:
                                        "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                    ingestResult: null,
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                },
                                flowId: "2",
                                status: FlowStatus.Finished,
                                initiator: null,
                                outcome: {
                                    reason: {
                                        message: "FAILED",
                                        __typename: "FlowFailureReasonGeneral",
                                    },
                                    __typename: "FlowFailedError",
                                },
                                timing: {
                                    awaitingExecutorSince: "2024-08-21T08:45:17+00:00",
                                    runningSince: "2024-08-21T08:45:18.722052534+00:00",
                                    finishedAt: null,
                                    __typename: "FlowTimingRecords",
                                },
                                startCondition: null,
                                configSnapshot: {
                                    fetchUncacheable: false,
                                    __typename: "FlowConfigurationIngest",
                                },
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
                        edges: [
                            {
                                node: {
                                    description: {
                                        datasetId:
                                            "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                        ingestResult: {
                                            numBlocks: 2,
                                            numRecords: 203,
                                            updatedWatermark: "2024-08-07T00:56:35+00:00",
                                            __typename: "FlowDescriptionUpdateResultSuccess",
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
                                },
                                __typename: "FlowEdge",
                            },
                            {
                                node: {
                                    description: {
                                        datasetId:
                                            "did:odf:fed0114053491ae4e9b40205d34e252b193ff97b490bd9f27a3a618f9f7221231ab99",
                                        ingestResult: null,
                                        __typename: "FlowDescriptionDatasetPollingIngest",
                                    },
                                    flowId: "2",
                                    status: FlowStatus.Finished,
                                    initiator: null,
                                    outcome: {
                                        reason: {
                                            message: "FAILED",
                                            __typename: "FlowFailureReasonGeneral",
                                        },
                                        __typename: "FlowFailedError",
                                    },
                                    timing: {
                                        awaitingExecutorSince: "2024-08-21T08:45:17+00:00",
                                        runningSince: "2024-08-21T08:45:18.722052534+00:00",
                                        finishedAt: null,
                                        __typename: "FlowTimingRecords",
                                    },
                                    startCondition: null,
                                    configSnapshot: {
                                        fetchUncacheable: false,
                                        __typename: "FlowConfigurationIngest",
                                    },
                                    __typename: "Flow",
                                },
                                __typename: "FlowEdge",
                            },
                        ],
                        __typename: "FlowConnection",
                    },
                    tiles: {
                        nodes: [
                            {
                                flowId: "0",
                                description: {
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                    datasetId: mockDatasetMainDataId,
                                },
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
                                    awaitingExecutorSince: "2024-08-21T08:46:19.426925618+00:00",
                                    runningSince: "2024-08-21T08:46:20.507478673+00:00",
                                    finishedAt: "2024-08-21T08:46:22.636437316+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                __typename: "Flow",
                            },
                            {
                                flowId: "1",
                                description: {
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                    datasetId: mockDatasetMainDataId,
                                },
                                status: FlowStatus.Finished,
                                initiator: null,
                                outcome: {
                                    reason: {
                                        message: "FAILED",
                                        __typename: "FlowFailureReasonGeneral",
                                    },
                                    __typename: "FlowFailedError",
                                },
                                timing: {
                                    awaitingExecutorSince: "2024-08-21T08:45:17+00:00",
                                    runningSince: "2024-08-21T08:45:18.722052534+00:00",
                                    finishedAt: null,
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
    connectionDataForWidget: mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.tiles as FlowConnectionDataFragment,
    involvedDatasets: [],
};

export const mockDatasetTriggerFlowMutation: DatasetTriggerFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerFlow: {
                        flow: {
                            configSnapshot: {
                                fetchUncacheable: true,
                                __typename: "FlowConfigurationIngest",
                            },
                            description: {
                                datasetId:
                                    "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                                ingestResult: null,
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
                            },
                            outcome: null,
                            timing: {
                                awaitingExecutorSince: "2024-02-16T09:26:04+00:00",
                                runningSince: null,
                                finishedAt: null,
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
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

export const mockDatasetTriggerFlowMutationError: DatasetTriggerFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerFlow: {
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
                                __typename: "FlowConfigurationIngest",
                            },
                            description: {
                                datasetId:
                                    "did:odf:fed01162400e9e5fb02d78805f48580f25589e8c3c21738999e28845f7c9d6818bec7",
                                ingestResult: null,
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
                                awaitingExecutorSince: null,
                                runningSince: null,
                                finishedAt: "2024-03-06T15:21:32.117446697+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
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
                                __typename: "FlowConfigurationIngest",
                            },
                            description: {
                                datasetId:
                                    "did:odf:fed016c0070664336545c0f49dc6a7a860c6862ab3336b630c2d7e779394a26da2e1e",
                                transformResult: null,
                                __typename: "FlowDescriptionDatasetExecuteTransform",
                            },
                            flowId: "595",
                            status: FlowStatus.Finished,
                            initiator: null,
                            outcome: {
                                __typename: "FlowSuccessResult",
                                message: "Succes",
                            },
                            timing: {
                                awaitingExecutorSince: "2024-03-15T19:43:38+00:00",
                                runningSince: "2024-03-15T19:43:39.414651763+00:00",
                                finishedAt: "2024-03-15T19:43:39.538294176+00:00",
                                __typename: "FlowTimingRecords",
                            },
                            startCondition: null,
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
                                },
                                {
                                    __typename: "FlowEventTaskChanged",
                                    eventId: "3568",
                                    eventTime: "2024-03-15T19:43:39.414651763+00:00",
                                    taskId: "594",
                                    taskStatus: TaskStatus.Running,
                                },
                                {
                                    __typename: "FlowEventTaskChanged",
                                    eventId: "3569",
                                    eventTime: "2024-03-15T19:43:39.538294176+00:00",
                                    taskId: "594",
                                    taskStatus: TaskStatus.Finished,
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
                            },
                            {
                                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                accountName: "bamu",
                                displayName: "bamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
                            },
                            {
                                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                accountName: "kamu",
                                displayName: "kamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
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

export const mockFlowsOutcome: FlowOutcomeDataFragment[] = [
    {
        __typename: "FlowSuccessResult",
        message: "success",
    },
    { __typename: "FlowAbortedResult", message: "Error" },
    {
        __typename: "FlowFailedError",
        reason: {
            __typename: "FlowFailureReasonGeneral",
            message: "Error",
        },
    },
];
