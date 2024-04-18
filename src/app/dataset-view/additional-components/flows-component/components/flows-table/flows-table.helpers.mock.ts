import { FlowStatus, FlowSummaryDataFragment, TimeUnit } from "src/app/api/kamu.graphql.interface";

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
            __typename: "FlowDescriptionUpdateResult",
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
                __typename: "FlowFailedMessage",
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
                __typename: "FlowFailedMessage",
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
    "awaiting since 58 minutes ago",
    "wake up time: in an hour",
    "wake up time: in 2 hours",
    "deadline time: in an hour",
    "running since 48 minutes ago",
    "finished in an hour",
    "aborted 2 hours ago",
    "failed 2 hours ago",
];

export const tooltipTextResults: string[] = [
    "awaiting since: Mar 14th 2024, 12:24:29 PM",
    "Wake up time: Mar 14th 2024, 2:24:29 PM",
    "Wake up time: Mar 14th 2024, 3:24:29 PM",
    "Deadline time: Mar 14th 2024, 2:24:29 PM",
    "Start running time: Mar 14th 2024, 12:34:29 PM",
    "Completed time: Mar 14th 2024, 2:24:29 PM",
    "Aborted time: Mar 14th 2024, 11:24:29 AM",
    "Start running time: Mar 14th 2024, 11:24:29 AM",
];
