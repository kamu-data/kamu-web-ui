import {
    AccountType,
    DatasetFlowBatchingMutation,
    DatasetFlowScheduleMutation,
    DatasetPauseFlowsMutation,
    DatasetResumeFlowsMutation,
    DatasetTriggerFlowMutation,
    FlowConnectionDataFragment,
    FlowOutcome,
    FlowStatus,
    FlowSummaryDataFragment,
    GetDatasetListFlowsQuery,
} from "./../kamu.graphql.interface";
import { GetDatasetFlowConfigsQuery, DatasetKind, TimeUnit, TimeDeltaInput } from "../kamu.graphql.interface";
import { FlowsTableData } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.types";

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
                id: "12345",
                accountName: "kamu",
                __typename: "Account",
            },
            alias: "account.transactions",
            __typename: "Dataset",
            flows: {
                configs: {
                    __typename: "DatasetFlowConfigs",
                    byType: {
                        paused: true,
                        schedule: {
                            every: 3,
                            unit: TimeUnit.Hours,
                            __typename: "TimeDelta",
                        },
                        batching: null,
                        __typename: "FlowConfiguration",
                    },
                },
                __typename: "DatasetFlows",
            },
        },
        __typename: "Datasets",
    },
};

export const mockBatchingGetDatasetFlowConfigsSuccess: GetDatasetFlowConfigsQuery = {
    datasets: {
        byId: {
            id: "did:odf:fed0127044b7b7e427f627e0ffb9f2b9b1e36a3795c7400d5b209e6661a9ad2f5a2a4",
            kind: DatasetKind.Derivative,
            name: "account.tokens.portfolio",
            owner: {
                id: "12345",
                accountName: "kamu",
                __typename: "Account",
            },
            alias: "account.tokens.portfolio",
            __typename: "Dataset",
            flows: {
                configs: {
                    __typename: "DatasetFlowConfigs",
                    byType: {
                        paused: true,
                        schedule: null,
                        batching: {
                            throttlingPeriod: {
                                every: 4,
                                unit: TimeUnit.Minutes,
                                __typename: "TimeDelta",
                            },
                            minimalDataBatch: null,
                            __typename: "FlowConfigurationBatching",
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

export const mockSetDatasetFlowScheduleSuccess: DatasetFlowScheduleMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfigSchedule: {
                        __typename: "SetFlowConfigSuccess",
                        message: "Success",
                        config: {
                            schedule: {
                                every: 10,
                                unit: TimeUnit.Hours,
                                __typename: "TimeDelta",
                            },
                            __typename: "FlowConfiguration",
                        },
                    },
                    __typename: "DatasetFlowConfigsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockSetDatasetFlowScheduleError: DatasetFlowScheduleMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfigSchedule: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Root,
                        actualDatasetKind: DatasetKind.Derivative,
                    },
                    __typename: "DatasetFlowConfigsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockSetDatasetFlowBatchingSuccess: DatasetFlowBatchingMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfigBatching: {
                        __typename: "SetFlowConfigSuccess",
                        message: "Success",
                        config: {
                            batching: {
                                throttlingPeriod: {
                                    every: 5,
                                    unit: TimeUnit.Minutes,
                                    __typename: "TimeDelta",
                                },
                                minimalDataBatch: 123,
                                __typename: "FlowConfigurationBatching",
                            },
                            __typename: "FlowConfiguration",
                        },
                    },
                    __typename: "DatasetFlowConfigsMut",
                },
                __typename: "DatasetFlowsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockSetDatasetFlowBatchingError: DatasetFlowBatchingMutation = {
    datasets: {
        byId: {
            flows: {
                configs: {
                    setConfigBatching: {
                        __typename: "FlowIncompatibleDatasetKind",
                        message: "Error",
                        expectedDatasetKind: DatasetKind.Derivative,
                        actualDatasetKind: DatasetKind.Root,
                    },
                    __typename: "DatasetFlowConfigsMut",
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
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestResult: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Queued,
        initiator: null,
        outcome: null,
        timing: {
            activateAt: "2024-02-12T18:22:30+00:00",
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
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Success,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
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
        flowId: "414",
        status: FlowStatus.Running,
        initiator: null,
        outcome: null,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
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
        flowId: "414",
        status: FlowStatus.Waiting,
        initiator: null,
        outcome: null,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
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
        flowId: "414",
        status: FlowStatus.Scheduled,
        initiator: null,
        outcome: null,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
            runningSince: "2024-02-12T18:21:27.477789591+00:00",
            finishedAt: "2024-02-12T18:21:29.554197038+00:00",
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
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Aborted,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
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
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Cancelled,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
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
        flowId: "414",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Failed,
        timing: {
            activateAt: "2024-02-12T18:21:26+00:00",
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
                configs: {
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
                configs: {
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
                configs: {
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
                configs: {
                    resumeFlows: false,
                },
            },
        },
    },
};

export const mockGetDatasetListFlowsQuery: GetDatasetListFlowsQuery = {
    datasets: {
        byId: {
            metadata: {
                currentPollingSource: {
                    __typename: "SetPollingSource",
                    fetch: {
                        __typename: "FetchStepUrl",
                        url: "http://test.com",
                    },
                },
                currentTransform: null,
            },
            flows: {
                runs: {
                    listFlows: {
                        nodes: [
                            {
                                description: {
                                    datasetId:
                                        "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8",
                                    ingestResult: null,
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                },
                                flowId: "90",
                                status: FlowStatus.Queued,
                                initiator: null,
                                outcome: null,
                                timing: {
                                    activateAt: "2024-02-13T10:11:25+00:00",
                                    runningSince: null,
                                    finishedAt: null,
                                    __typename: "FlowTimingRecords",
                                },
                                __typename: "Flow",
                            },
                            {
                                description: {
                                    datasetId:
                                        "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8",
                                    ingestResult: null,
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                },
                                flowId: "88",
                                status: FlowStatus.Finished,
                                initiator: null,
                                outcome: FlowOutcome.Success,
                                timing: {
                                    activateAt: "2024-02-13T10:10:25+00:00",
                                    runningSince: "2024-02-13T10:10:25.468811294+00:00",
                                    finishedAt: "2024-02-13T10:10:25.488660882+00:00",
                                    __typename: "FlowTimingRecords",
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
                                            "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8",
                                        ingestResult: null,
                                        __typename: "FlowDescriptionDatasetPollingIngest",
                                    },
                                    flowId: "90",
                                    status: FlowStatus.Queued,
                                    initiator: null,
                                    outcome: null,
                                    timing: {
                                        activateAt: "2024-02-13T10:11:25+00:00",
                                        runningSince: null,
                                        finishedAt: null,
                                        __typename: "FlowTimingRecords",
                                    },
                                    __typename: "Flow",
                                },
                                __typename: "FlowEdge",
                            },
                            {
                                node: {
                                    description: {
                                        datasetId:
                                            "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e8",
                                        ingestResult: null,
                                        __typename: "FlowDescriptionDatasetPollingIngest",
                                    },
                                    flowId: "88",
                                    status: FlowStatus.Finished,
                                    initiator: null,
                                    outcome: FlowOutcome.Success,
                                    timing: {
                                        activateAt: "2024-02-13T10:10:25+00:00",
                                        runningSince: "2024-02-13T10:10:25.468811294+00:00",
                                        finishedAt: "2024-02-13T10:10:25.488660882+00:00",
                                        __typename: "FlowTimingRecords",
                                    },
                                    __typename: "Flow",
                                },
                                __typename: "FlowEdge",
                            },
                        ],
                        __typename: "FlowConnection",
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

export const mockFlowsTableData: FlowsTableData = {
    connectionData: mockGetDatasetListFlowsQuery.datasets.byId?.flows.runs.listFlows as FlowConnectionDataFragment,
    source: {
        __typename: "FetchStepUrl",
        url: "http://mock.com",
    },
    transformData: {
        numInputs: 0,
        engine: "",
    },
};

export const mockDatasetTriggerFlowMutation: DatasetTriggerFlowMutation = {
    datasets: {
        byId: {
            flows: {
                runs: {
                    triggerFlow: {
                        flow: {
                            description: {
                                datasetId:
                                    "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
                                ingestResult: null,
                                __typename: "FlowDescriptionDatasetPollingIngest",
                            },
                            flowId: "0",
                            status: FlowStatus.Queued,
                            initiator: {
                                id: "12345",
                                accountName: "kamu",
                                displayName: "kamu",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                isAdmin: true,
                                __typename: "Account",
                            },
                            outcome: null,
                            timing: {
                                activateAt: "2024-02-16T09:26:04+00:00",
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
