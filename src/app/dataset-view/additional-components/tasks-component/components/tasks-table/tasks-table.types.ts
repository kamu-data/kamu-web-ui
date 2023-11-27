import { Account, AccountType, Maybe, Scalars, TaskOutcome, TaskStatus } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";

export interface TaskElement {
    /** Whether the task was ordered to be cancelled */
    cancellationRequested: Scalars["Boolean"];
    /** Time when cancellation of task was requested */
    cancellationRequestedAt?: Maybe<Scalars["DateTime"]>;
    /** Time when task was originally created and placed in a queue */
    createdAt: Scalars["DateTime"];
    /** Time when task has reached a final outcome */
    finishedAt?: Maybe<Scalars["DateTime"]>;
    /**
     * Describes a certain final outcome of the task once it reaches the
     * "finished" status
     */
    outcome?: Maybe<TaskOutcome>;
    /** Time when task transitioned into a running state */
    ranAt?: Maybe<Scalars["DateTime"]>;
    /** Life-cycle status of a task */
    status: TaskStatus;
    /** Unique and stable identitfier of this task */
    taskId: Scalars["TaskID"];
    description: string;
    information: string;
    creator: Account;
    options?: unknown;
}

export const mockTasks: TaskElement[] = [
    {
        cancellationRequested: false,
        createdAt: "2023-11-23 12:00:00",
        taskId: "1",
        status: TaskStatus.Running,
        description: "Manual polling source updating...",
        information: "Polling data from http://example.com",
        creator: {
            accountName: "kamu",
            accountType: AccountType.Organization,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
            displayName: "unknown",
            id: "1",
        },
    },
    {
        cancellationRequested: false,
        createdAt: "2023-11-23 12:00:00",
        taskId: "2",
        status: TaskStatus.Finished,
        outcome: TaskOutcome.Success,
        description: "Scheduled pollins source updated",
        information: "Ingested 123 new records",
        finishedAt: "2023-11-23 12:35:00",
        creator: {
            accountName: "kamu-test",
            accountType: AccountType.Organization,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
            displayName: "unknown",
            id: "2",
        },
    },
    {
        cancellationRequested: false,
        createdAt: "2023-11-23 12:00:00",
        taskId: "3",
        status: TaskStatus.Finished,
        outcome: TaskOutcome.Failed,
        description: "Manual polling source updated",
        information: "An error occured, see more details",
        finishedAt: "2023-11-23 12:00:10",
        creator: {
            accountName: "kamu-test",
            accountType: AccountType.Organization,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
            displayName: "unknown",
            id: "2",
        },
    },
];

export const updatedRunningTaskElement: TaskElement = {
    cancellationRequested: false,
    createdAt: "2022-10-01 12:00:00",
    taskId: "5",
    status: TaskStatus.Running,
    description: "Scheduled pollins source updated",
    information: "Polling data from http://data.com",
    creator: {
        accountName: "kamu-test",
        accountType: AccountType.Organization,
        avatarUrl: AppValues.DEFAULT_AVATAR_URL,
        displayName: "unknown",
        id: "2",
    },
};

export const updatedFinishedTaskElement: TaskElement = {
    cancellationRequested: false,
    createdAt: "2022-10-01 12:00:00",
    taskId: "5",
    status: TaskStatus.Finished,
    outcome: TaskOutcome.Success,
    description: "Manual pollins source updated",
    information: "Ingested 350 new records",
    creator: {
        accountName: "kamu-test",
        accountType: AccountType.Organization,
        avatarUrl: AppValues.DEFAULT_AVATAR_URL,
        displayName: "unknown",
        id: "2",
    },
};
