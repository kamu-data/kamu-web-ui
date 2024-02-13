import {
    DatasetFlowBatchingMutation,
    DatasetFlowScheduleMutation,
    FlowOutcome,
    FlowStatus,
    FlowSummaryDataFragment,
} from "./../kamu.graphql.interface";
import { GetDatasetFlowConfigsQuery, DatasetKind, TimeUnit, TimeDeltaInput } from "../kamu.graphql.interface";

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

export const mockFlowSummaryDataFragments: FlowSummaryDataFragment[] = [
    {
        description: {
            datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
            ingestedRecordsCount: null,
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
            ingestedRecordsCount: null,
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
            ingestedRecordsCount: null,
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "413",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Success,
        timing: {
            activateAt: "2024-02-12T18:20:24+00:00",
            runningSince: "2024-02-12T18:20:25.308435148+00:00",
            finishedAt: "2024-02-12T18:20:26.401066641+00:00",
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
];
