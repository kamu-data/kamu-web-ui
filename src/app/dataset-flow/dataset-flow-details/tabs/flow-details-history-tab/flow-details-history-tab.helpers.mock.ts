/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountProvider,
    AccountType,
    DatasetFlowType,
    FlowHistoryDataFragment,
    FlowOutcomeDataFragment,
    FlowStatus,
    FlowSummaryDataFragment,
    TaskStatus,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
import { mockDatasetSearchResult } from "src/app/search/mock.data";

export const mockHistoryFragmentWithFinishedStatus: FlowHistoryDataFragment = {
    __typename: "FlowEventTaskChanged",
    eventId: "2",
    eventTime: "2024-03-13T13:54:30.656488373+00:00",
    taskId: "1",
    taskStatus: TaskStatus.Finished,
    task: {
        outcome: {
            __typename: "TaskOutcomeSuccess",
        },
    },
    nextAttemptAt: null,
};

export const mockHistoryFragmentWithQueuedStatus: FlowHistoryDataFragment = {
    __typename: "FlowEventTaskChanged",
    eventId: "2",
    eventTime: "2024-03-13T13:54:30.656488373+00:00",
    taskId: "1",
    taskStatus: TaskStatus.Queued,
    task: {
        outcome: null,
    },
    nextAttemptAt: null,
};

export const mockFlowSummaryDataFragmentIngestResult: FlowSummaryDataFragment = {
    datasetId: "did:odf:fed0136c76cdaf8552581e8cf738df7a9d8ba169db326b5af905a8f546da4df424751",
    description: {
        ingestResult: {
            __typename: "FlowDescriptionUpdateResultSuccess",
            numBlocks: 10,
            numRecords: 100,
        },
        pollingSource: {
            fetch: {
                __typename: "FetchStepUrl",
                url: "https://example.com/data.csv",
            },
        },
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
        initiatedAt: "2024-02-12T18:21:25+00:00",
        awaitingExecutorSince: "2024-02-12T18:21:26+00:00",
        runningSince: "2024-02-12T18:21:27.477789591+00:00",
        lastAttemptFinishedAt: "2024-02-12T18:21:29.554197038+00:00",
        __typename: "FlowTimingRecords",
    },
    retryPolicy: null,
    tasks: [],
    __typename: "Flow",
};

export const mockFlowHistoryDataFragmentForDescriptions: FlowHistoryDataFragment[] = [
    {
        __typename: "FlowEventInitiated",
        eventId: "0",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerAutoPolling",
        },
    },
    {
        __typename: "FlowEventAborted",
        eventId: "1",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
    },
    {
        __typename: "FlowEventTaskChanged",
        eventId: "2",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        taskId: "1",
        taskStatus: TaskStatus.Running,
        task: {
            outcome: null,
        },
        nextAttemptAt: null,
    },
    {
        __typename: "FlowEventTaskChanged",
        eventId: "3",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        taskId: "2",
        taskStatus: TaskStatus.Finished,
        task: {
            outcome: {
                __typename: "TaskOutcomeSuccess",
            },
        },
        nextAttemptAt: null,
    },
    {
        __typename: "FlowEventTriggerAdded",
        eventId: "4",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerManual",
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
        },
    },
    {
        __typename: "FlowEventTriggerAdded",
        eventId: "5",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerInputDatasetFlow",
            flowId: "1",
            flowType: DatasetFlowType.ExecuteTransform,
            dataset: mockDatasetSearchResult.datasets[0],
        },
    },
    {
        __typename: "FlowEventTriggerAdded",
        eventId: "6",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerPush",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "7",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionSchedule",
            wakeUpAt: "2024-03-13T13:58:30.656488373+00:00",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "8",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionExecutor",
            taskId: "1",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "9",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionBatching",
            activeBatchingRule: {
                minRecordsToAwait: 500,
                maxBatchingInterval: {
                    every: 5,
                    unit: TimeUnit.Hours,
                },
            },
            batchingDeadline: "2022-08-05T21:17:30.613911358+00:00",
            accumulatedRecordsCount: 100,
            watermarkModified: true,
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "10",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionThrottling",
            intervalSec: 120,
            wakeUpAt: "2024-02-12T18:22:30+00:00",
            shiftedFrom: "2024-02-12T18:22:29+00:00",
        },
    },
    {
        __typename: "FlowEventScheduledForActivation",
        eventId: "11",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        scheduledForActivationAt: "2024-03-13T14:54:30.656488373+00:00",
    },
    {
        __typename: "FlowConfigSnapshotModified",
        eventId: "12",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        configSnapshot: {
            __typename: "FlowConfigRuleIngest",
        },
    },
];

export const eventFlowDescriptionsResultHistoryTab: string[] = [
    "Flow initiated automatically",
    "Flow was aborted",
    "Reset to seed task running",
    "Reset to seed task finished successfully",
    "Additionally triggered manually",
    "Additionally triggered after input dataset event",
    "Additionally triggered after push event",
    "Waiting for scheduled execution",
    "Waiting for free executor",
    "Waiting for batching condition",
    "Waiting for throttling condition",
    "Flow scheduled for activation",
    "Flow configuration was modified",
];

export const mockFlowHistoryDataFragmentForIconOptions: FlowHistoryDataFragment[] = [
    {
        __typename: "FlowEventInitiated",
        eventId: "0",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerAutoPolling",
        },
    },
    {
        __typename: "FlowEventAborted",
        eventId: "1",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
    },
    {
        __typename: "FlowEventTaskChanged",
        eventId: "2",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        taskId: "1",
        taskStatus: TaskStatus.Running,
        task: {
            outcome: null,
        },
        nextAttemptAt: null,
    },
    {
        __typename: "FlowEventTriggerAdded",
        eventId: "3",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerPush",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "4",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionThrottling",
            intervalSec: 120,
            wakeUpAt: "2024-02-12T18:22:30+00:00",
            shiftedFrom: "2024-02-12T18:22:29+00:00",
        },
    },
    {
        __typename: "FlowEventScheduledForActivation",
        eventId: "5",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        scheduledForActivationAt: "2024-03-13T14:54:30.656488373+00:00",
    },
    {
        __typename: "FlowConfigSnapshotModified",
        eventId: "6",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        configSnapshot: {
            __typename: "FlowConfigRuleIngest",
        },
    },
];

export const flowEventIconOptionsResults: { icon: string; class: string }[] = [
    { icon: "flag_circle", class: "completed-status" },
    { icon: "cancel", class: "aborted-outcome" },
    { icon: "radio_button_checked", class: "running-status" },
    { icon: "add_circle", class: "text-muted" },
    { icon: "downloading", class: "text-muted" },
    { icon: "timer", class: "text-muted" },
    { icon: "outbound", class: "text-muted" },
    { icon: "check_circle", class: "completed-status" },
    { icon: "dangerous", class: "failed-status" },
    { icon: "cancel", class: "aborted-outcome" },
    { icon: "radio_button_checked", class: "queued-status" },
];

export const mockFlowHistoryDataFragmentForSubMessages: FlowHistoryDataFragment[] = [
    ...mockFlowHistoryDataFragmentForIconOptions,
    {
        __typename: "FlowEventInitiated",
        eventId: "0",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerManual",
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
        },
    },
    {
        __typename: "FlowEventInitiated",
        eventId: "0",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        trigger: {
            __typename: "FlowTriggerInputDatasetFlow",
            flowId: "1",
            flowType: DatasetFlowType.ExecuteTransform,
            dataset: mockDatasetSearchResult.datasets[0],
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "4",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionBatching",
            activeBatchingRule: {
                minRecordsToAwait: 500,
                maxBatchingInterval: {
                    every: 5,
                    unit: TimeUnit.Hours,
                },
            },
            batchingDeadline: "2022-08-05T21:17:30.613911358+00:00",
            accumulatedRecordsCount: 100,
            watermarkModified: true,
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "4",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionExecutor",
            taskId: "5",
        },
    },
    {
        __typename: "FlowEventStartConditionUpdated",
        eventId: "4",
        eventTime: "2024-03-13T13:54:30.656488373+00:00",
        startCondition: {
            __typename: "FlowStartConditionSchedule",
            wakeUpAt: "2024-03-13T15:54:30.656488373+00:00",
        },
    },
];

export const flowEventSubMessageResults: string[] = [
    "",
    "",
    "Task #1",
    "",
    "Wake up time at Feb 12th 2024 8:22:30 PM GMT+02:00, shifted from 8:22:29 PM",
    "Activating at Mar 13th 2024 4:54:30 PM GMT+02:00",
    "Modified by ingest rule",
    "Triggered by kamu",
    "Input dataset: kamu/alberta.case-details",
    "Accumulated 100/500 records. Watermark modified. Deadline at Aug 6th 2022 12:17:30 AM GMT+03:00", //1
    "Task #5",
    "Wake up time at Mar 13th 2024 5:54:30 PM GMT+02:00",
    "An error occurred, see logs for more details",
    "Dataset is up-to-date",
    "Ingested 100 new records in 10 new blocks",
    "Transformed 10 new records in 2 new blocks",
    "Failed to get increment. Block is missing: f1620bc8ac3dbfd913b83d35ee853dd1b11987874b4f5071f6f31d585c09d4579fc5b",
    "Task #1 (retry attempt 1 of 3)",
];

export const mockFlowHistoryDataOutcomeOptions: FlowOutcomeDataFragment[] = [
    {
        __typename: "FlowSuccessResult",
        message: "Success",
    },
    {
        __typename: "FlowFailedError",
        reason: {
            __typename: "TaskFailureReasonGeneral",
            message: "Failed due to some reason",
        },
    },
    {
        __typename: "FlowAbortedResult",
        message: "Aborted by user",
    },
];

export const flowOutcomeOptionsResults: { icon: string; class: string }[] = [
    { icon: "check_circle", class: "completed-status" },
    { icon: "dangerous", class: "failed-status" },
    { icon: "cancel", class: "aborted-outcome" },
];
