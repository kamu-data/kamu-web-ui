/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { format } from "date-fns/format";
import {
    FlowConfigSnapshotModified,
    FlowEventInitiated,
    FlowEventScheduledForActivation,
    FlowEventStartConditionUpdated,
    FlowEventTaskChanged,
    FlowEventTriggerAdded,
    FlowHistoryDataFragment,
    FlowOutcomeDataFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowTriggerInstance,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import { pluralize } from "src/app/common/helpers/app.helpers";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import AppValues from "src/app/common/values/app.values";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";

export class DatasetFlowDetailsHelpers {
    public static flowEventDescription(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): string {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated":
                return `Flow initiated ${this.describeTrigger((flowEvent as FlowEventInitiated).trigger)}`;
            case "FlowEventAborted":
                return "Flow was aborted";
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                return `${FlowTableHelpers.flowTypeDescription(
                    flowDetails,
                )} task ${DatasetFlowDetailsHelpers.flowEventEndOfMessage(event)}`;
            }
            case "FlowEventTriggerAdded":
                return `Additionally triggered ${this.describeTrigger((flowEvent as FlowEventTriggerAdded).trigger)}`;
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                return `Waiting for ${this.describeStartCondition(startConditionEvent)}`;
            }
            case "FlowEventScheduledForActivation":
                return "Flow scheduled for activation";
            case "FlowConfigSnapshotModified":
                return "Flow configuration was modified";
            /* istanbul ignore next */
            default:
                throw new Error("Unknown event typename");
        }
    }

    public static flowEventIconOptions(flowEvent: FlowHistoryDataFragment): { icon: string; class: string } {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated":
                return { icon: "flag_circle", class: "completed-status" };
            case "FlowEventAborted":
                return { icon: "cancel", class: "aborted-outcome" };
            case "FlowEventTriggerAdded":
                return { icon: "add_circle", class: "text-muted" };
            case "FlowEventStartConditionUpdated":
                return { icon: "downloading", class: "text-muted" };
            case "FlowEventScheduledForActivation":
                return { icon: "timer", class: "text-muted" };
            case "FlowConfigSnapshotModified":
                return { icon: "outbound", class: "text-muted" };
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                switch (event.taskStatus) {
                    case TaskStatus.Finished:
                        switch (event.task.outcome?.__typename) {
                            case "TaskOutcomeSuccess":
                                return { icon: "check_circle", class: "completed-status" };
                            case "TaskOutcomeFailed":
                                return { icon: "dangerous", class: "failed-status" };
                            case "TaskOutcomeCancelled":
                                return { icon: "cancel", class: "aborted-outcome" };
                            /* istanbul ignore next */
                            default:
                                throw new Error("Unsupported task outcome");
                        }

                    case TaskStatus.Queued:
                        return { icon: "radio_button_checked", class: "queued-status" };
                    case TaskStatus.Running:
                        return { icon: "radio_button_checked", class: "running-status" };
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unsupported flow event typename");
                }
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unsupported flow event typename");
        }
    }

    public static flowOutcomeOptions(outcome: FlowOutcomeDataFragment): { icon: string; class: string } {
        switch (outcome.__typename) {
            case "FlowSuccessResult":
                return { icon: "check_circle", class: "completed-status" };
            case "FlowFailedError":
                return { icon: "dangerous", class: "failed-status" };
            case "FlowAbortedResult":
                return { icon: "cancel", class: "aborted-outcome" };
            /* istanbul ignore next */
            default:
                throw new Error("Unsupported flow outcome");
        }
    }

    public static flowEventSubMessage(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): string {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated":
            case "FlowEventTriggerAdded":
                return this.describeTriggerDetails((flowEvent as FlowEventInitiated).trigger);
            case "FlowConfigSnapshotModified": {
                const event = flowEvent as FlowConfigSnapshotModified;
                switch (event.configSnapshot.__typename) {
                    case "FlowConfigRuleCompaction":
                        return "Modified by compaction rule";
                    case "FlowConfigRuleIngest":
                        return "Modified by ingest rule";
                    case "FlowConfigRuleReset":
                        return "Modified by reset rule";
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown configSnapshot typename");
                }
            }
            case "FlowEventAborted":
                return "";
            case "FlowEventScheduledForActivation": {
                const event = flowEvent as FlowEventScheduledForActivation;
                return `Activating at ${format(event.scheduledForActivationAt, AppValues.CRON_EXPRESSION_DATE_FORMAT)}`;
            }
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                switch (event.taskStatus) {
                    case TaskStatus.Running:
                        return this.describeTaskIdentity(event.taskId, flowDetails);
                    case TaskStatus.Finished:
                        switch (event.task.outcome?.__typename) {
                            case "TaskOutcomeCancelled":
                                return "Task was cancelled";
                            case "TaskOutcomeFailed": {
                                let mainMessage: string;
                                switch (event.task.outcome.reason.__typename) {
                                    case "TaskFailureReasonGeneral":
                                        mainMessage = `An error occurred, see logs for more details`;
                                        break;
                                    case "TaskFailureReasonInputDatasetCompacted":
                                        mainMessage = `Input dataset <span class="text-small text-danger">${event.task.outcome.reason.inputDataset.name}</span> was compacted`;
                                        break;
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown flow failed error";
                                }

                                if (flowDetails.retryPolicy) {
                                    if (event.nextAttemptAt) {
                                        const nextRetryAttemptNo =
                                            flowDetails.tasks.findIndex((task) => task.taskId === event.taskId) + 1;
                                        return (
                                            `${mainMessage}<br/>Retry attempt ${nextRetryAttemptNo} of ${flowDetails.retryPolicy.maxAttempts} ` +
                                            `scheduled in ${DataHelpers.durationTask(event.eventTime, event.nextAttemptAt)}`
                                        );
                                    } else {
                                        return `${mainMessage}<br/>No more retry attempts left`;
                                    }
                                } else {
                                    return mainMessage;
                                }
                            }
                            case "TaskOutcomeSuccess": {
                                switch (flowDetails.description.__typename) {
                                    case "FlowDescriptionDatasetPollingIngest":
                                    case "FlowDescriptionDatasetPushIngest":
                                        return flowDetails.description.ingestResult?.__typename ===
                                            "FlowDescriptionUpdateResultUnknown"
                                            ? `${flowDetails.description.ingestResult.message}`
                                            : flowDetails.description.ingestResult?.__typename ===
                                                "FlowDescriptionUpdateResultSuccess"
                                              ? `Ingested ${flowDetails.description.ingestResult.numRecords} new ${pluralize(
                                                    "record",
                                                    flowDetails.description.ingestResult.numRecords,
                                                )} in ${flowDetails.description.ingestResult.numBlocks} new ${pluralize(
                                                    "block",
                                                    flowDetails.description.ingestResult.numBlocks,
                                                )}`
                                              : flowDetails.description.ingestResult?.__typename ===
                                                      "FlowDescriptionUpdateResultUpToDate" &&
                                                  flowDetails.description.ingestResult.uncacheable &&
                                                  ((flowDetails.configSnapshot?.__typename === "FlowConfigRuleIngest" &&
                                                      !flowDetails.configSnapshot.fetchUncacheable) ||
                                                      !flowDetails.configSnapshot)
                                                ? "Source is uncacheable: to re-scan the data, use force update"
                                                : "Dataset is up-to-date";

                                    case "FlowDescriptionDatasetExecuteTransform":
                                        return flowDetails.description.transformResult?.__typename ===
                                            "FlowDescriptionUpdateResultUnknown"
                                            ? `${flowDetails.description.transformResult.message}`
                                            : flowDetails.description.transformResult?.__typename ===
                                                "FlowDescriptionUpdateResultSuccess"
                                              ? `Transformed ${flowDetails.description.transformResult.numRecords} new ${pluralize(
                                                    "record",
                                                    flowDetails.description.transformResult.numRecords,
                                                )} in ${flowDetails.description.transformResult.numBlocks} new ${pluralize(
                                                    "block",
                                                    flowDetails.description.transformResult.numBlocks,
                                                )}`
                                              : "Dataset is up-to-date";

                                    case "FlowDescriptionDatasetHardCompaction":
                                        switch (flowDetails.description.compactionResult?.__typename) {
                                            case "FlowDescriptionHardCompactionSuccess":
                                                return `Compacted ${flowDetails.description.compactionResult.originalBlocksCount} original blocks to ${flowDetails.description.compactionResult.resultingBlocksCount} resulting blocks`;

                                            case "FlowDescriptionHardCompactionNothingToDo":
                                                return flowDetails.description.compactionResult.message;
                                            /* istanbul ignore next */
                                            default:
                                                return "Unknown compaction result typename";
                                        }

                                    case "FlowDescriptionDatasetReset":
                                        switch (flowDetails.description.__typename) {
                                            case "FlowDescriptionDatasetReset":
                                                return "All dataset history has been cleared.";
                                            /* istanbul ignore next */
                                            default:
                                                return "Unknown reset result typename";
                                        }

                                    // TODO
                                    //  - GC
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown description typename";
                                }
                            }
                            /* istanbul ignore next */
                            default:
                                throw new Error("Unknown flow outcome");
                        }
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown task status");
                }
            }
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                return this.describeStartConditionDetails(startConditionEvent, flowDetails);
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown event typename");
        }
    }

    public static flowEventEndOfMessage(element: FlowEventTaskChanged): string {
        switch (element.taskStatus) {
            case TaskStatus.Finished:
                switch (element.task.outcome?.__typename) {
                    case "TaskOutcomeSuccess":
                        return "finished successfully";
                    case "TaskOutcomeFailed":
                        return "failed";
                    case "TaskOutcomeCancelled":
                        return "was cancelled";
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unsupported task outcome");
                }
            case TaskStatus.Running:
                return "running";
            /* istanbul ignore next */
            default:
                throw new Error(`Unsupported task status`);
        }
    }

    private static describeTrigger(trigger: FlowTriggerInstance): string {
        switch (trigger.__typename) {
            case "FlowTriggerAutoPolling":
                return "automatically";
            case "FlowTriggerManual":
                return "manually";
            case "FlowTriggerPush":
                return "after push event";
            case "FlowTriggerInputDatasetFlow":
                return "after input dataset event";
            /* istanbul ignore next */
            default:
                throw new Error("Unknown trigger typename");
        }
    }

    private static describeTriggerDetails(trigger: FlowTriggerInstance): string {
        switch (trigger.__typename) {
            case "FlowTriggerAutoPolling":
                return "";
            case "FlowTriggerManual":
                return `Triggered by ${trigger.initiator.accountName}`;
            case "FlowTriggerPush":
                return "";
            case "FlowTriggerInputDatasetFlow":
                return `Input dataset: ${trigger.dataset.owner.accountName}/${trigger.dataset.name}`;
            /* istanbul ignore next */
            default:
                throw new Error("Unknown trigger typename");
        }
    }

    private static describeStartCondition(startConditionEvent: FlowEventStartConditionUpdated): string {
        switch (startConditionEvent.startCondition.__typename) {
            case "FlowStartConditionThrottling":
                return "throttling condition";
            case "FlowStartConditionBatching":
                return "batching condition";
            case "FlowStartConditionExecutor":
                return "free executor";
            case "FlowStartConditionSchedule":
                return "scheduled execution";
            /* istanbul ignore next */
            default:
                throw new Error("Unknown start condition typename");
        }
    }

    private static describeStartConditionDetails(
        startConditionEvent: FlowEventStartConditionUpdated,
        flowDetails: FlowSummaryDataFragment,
    ): string {
        const startCondition: FlowStartCondition = startConditionEvent.startCondition;
        switch (startCondition.__typename) {
            case "FlowStartConditionThrottling":
                return `Wake up time at ${format(
                    startCondition.wakeUpAt,
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}, shifted from ${format(startCondition.shiftedFrom, AppValues.TIME_FORMAT)}`;
            case "FlowStartConditionBatching":
                return `Accumulated ${startCondition.accumulatedRecordsCount}/${
                    startCondition.activeBatchingRule.minRecordsToAwait
                } records. Watermark ${
                    startCondition.watermarkModified ? "modified" : "unchanged"
                }. Deadline at ${format(startCondition.batchingDeadline, AppValues.CRON_EXPRESSION_DATE_FORMAT)}`;
            case "FlowStartConditionExecutor":
                return this.describeTaskIdentity(startCondition.taskId, flowDetails);
            case "FlowStartConditionSchedule":
                return `Wake up time at ${format(startCondition.wakeUpAt, AppValues.CRON_EXPRESSION_DATE_FORMAT)}`;
            /* istanbul ignore next */
            default:
                throw new Error("Unknown start condition typename");
        }
    }

    private static describeTaskIdentity(taskId: string, flowDetails: FlowSummaryDataFragment): string {
        const taskDescription = `Task #${taskId}`;
        if (flowDetails.retryPolicy && flowDetails.tasks[0].taskId !== taskId) {
            const retryAttemptNo = flowDetails.tasks.findIndex((task) => task.taskId === taskId);
            return `${taskDescription} (retry attempt ${retryAttemptNo} of ${flowDetails.retryPolicy.maxAttempts})`;
        } else {
            return taskDescription;
        }
    }

    public static flowStatusAnimationSrc(status: FlowStatus): string {
        switch (status) {
            case FlowStatus.Running:
                return "assets/images/gear.gif";
            case FlowStatus.Waiting:
                return "assets/images/hourglass.gif";
            case FlowStatus.Retrying:
                return "assets/images/rotating-arrow.gif";
            default:
                return "";
        }
    }
}
