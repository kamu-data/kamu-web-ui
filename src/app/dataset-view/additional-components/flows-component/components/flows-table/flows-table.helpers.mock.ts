import { FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

export const expectationsDesriptionColumnOptions = [
    {
        icon: "check_circle",
        class: "completed-status",
    },
    { icon: "radio_button_checked", class: "running-status" },
    { icon: "radio_button_checked", class: "waiting-status" },
    { icon: "cancel", class: "aborted-outcome" },
    { icon: "cancel", class: "cancelled-outcome" },
    { icon: "dangerous", class: "failed-status" },
];

export const expectationsDescriptionEndOfMessage = ["finished", "running", "waiting", "aborted", "cancelled", "failed"];

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
                __typename: "FlowDescriptionUpdateResult",
                numBlocks: 2,
                numRecords: 10,
            },
            __typename: "FlowDescriptionDatasetExecuteTransform",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Success,
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
            },
            __typename: "FlowDescriptionDatasetPollingIngest",
        },
        flowId: "415",
        status: FlowStatus.Finished,
        initiator: null,
        outcome: FlowOutcome.Success,
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
        outcome: FlowOutcome.Cancelled,
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
        outcome: FlowOutcome.Aborted,
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
        outcome: FlowOutcome.Failed,
        timing: {
            awaitingExecutorSince: "2024-02-12T18:22:30+00:00",
            runningSince: null,
            finishedAt: null,
            __typename: "FlowTimingRecords",
        },
        __typename: "Flow",
    },
];
