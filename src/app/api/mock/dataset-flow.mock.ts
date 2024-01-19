import { DatasetFlowBatchingMutation, DatasetFlowScheduleMutation } from "./../kamu.graphql.interface";
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
