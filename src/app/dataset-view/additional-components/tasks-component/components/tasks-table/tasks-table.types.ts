import { Task, TaskStatus } from "src/app/api/kamu.graphql.interface";

export interface TaskElement {
    description: string;
    information: string;
    creator: string;
    options?: unknown;
}
// __typename?: "Task";
// /** Whether the task was ordered to be cancelled */
// cancellationRequested: Scalars["Boolean"];
// /** Time when cancellation of task was requested */
// cancellationRequestedAt?: Maybe<Scalars["DateTime"]>;
// /** Time when task was originally created and placed in a queue */
// createdAt: Scalars["DateTime"];
// /** Time when task has reached a final outcome */
// finishedAt?: Maybe<Scalars["DateTime"]>;
// /**
//  * Describes a certain final outcome of the task once it reaches the
//  * "finished" status
//  */
// outcome?: Maybe<TaskOutcome>;
// /** Time when task transitioned into a running state */
// ranAt?: Maybe<Scalars["DateTime"]>;
// /** Life-cycle status of a task */
// status: TaskStatus;
// /** Unique and stable identitfier of this task */
// taskId: Scalars["TaskID"];

export const mockTasks: Task[] = [
    {
        __typename: "Task",
        cancellationRequested: false,
        createdAt: "2022-10-01 12:00:00",
        taskId: "1",
        status: TaskStatus.Running,
    },
    {
        __typename: "Task",
        cancellationRequested: false,
        createdAt: "2022-10-01 13:00:00",
        taskId: "2",
        status: TaskStatus.Finished,
    },
];
