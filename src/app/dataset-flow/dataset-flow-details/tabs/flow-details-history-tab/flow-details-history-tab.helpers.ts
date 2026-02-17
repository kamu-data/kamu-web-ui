/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    FlowActivationCause,
    FlowConfigSnapshotModified,
    FlowEventActivationCauseAdded,
    FlowEventInitiated,
    FlowEventScheduledForActivation,
    FlowEventStartConditionUpdated,
    FlowEventTaskChanged,
    FlowHistoryDataFragment,
    FlowOutcomeDataFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
    TaskStatus,
} from "@api/kamu.graphql.interface";
import { pluralize } from "@common/helpers/app.helpers";
import { DataHelpers } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import { format } from "date-fns/format";
import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowTableHelpers } from "src/app/dataset-flow/flows-table/flows-table.helpers";
import ProjectLinks from "src/app/project-links";

export class DatasetFlowDetailsHelpers {
    public static flowEventDescription(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): string {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated":
                return `Flow initiated ${this.describeActivationCause((flowEvent as FlowEventInitiated).activationCause)}`;
            case "FlowEventAborted":
                return "Flow was aborted";
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                return `${FlowTableHelpers.flowTypeDescription(
                    flowDetails,
                )} task ${DatasetFlowDetailsHelpers.flowEventEndOfMessage(event)}`;
            }
            case "FlowEventActivationCauseAdded":
                return `Additionally triggered ${this.describeActivationCause((flowEvent as FlowEventActivationCauseAdded).activationCause)}`;
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                return `Waiting for ${this.describeStartCondition(startConditionEvent)}`;
            }
            case "FlowEventScheduledForActivation":
                return "Flow scheduled for activation";
            case "FlowConfigSnapshotModified":
                return "Flow configuration was modified";
            case "FlowEventCompleted":
                return "Flow completed";
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
            case "FlowEventActivationCauseAdded":
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
            case "FlowEventCompleted":
                return { icon: "sports_score", class: "completed-status" };

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
            case "FlowEventActivationCauseAdded":
                return this.describeActivationCauseDetails((flowEvent as FlowEventInitiated).activationCause);
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
            case "FlowEventCompleted":
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
                                        mainMessage = `An${event.task.outcome.reason.recoverable ? "" : " unrecoverable"} error occurred, see logs for more details`;
                                        break;
                                    case "TaskFailureReasonInputDatasetCompacted":
                                        mainMessage = `Input dataset <span class="text-small text-danger">${event.task.outcome.reason.inputDataset.name}</span> was compacted`;
                                        break;
                                    case "TaskFailureReasonWebhookDeliveryProblem":
                                        mainMessage = `${event.task.outcome.reason.message}<br>Target URL: ${event.task.outcome.reason.targetUrl}`;
                                        break;
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown flow failed error";
                                }

                                if (flowDetails.retryPolicy) {
                                    if (event.nextAttemptAt) {
                                        const nextRetryAttemptNo =
                                            flowDetails.taskIds.findIndex((taskId) => taskId === event.taskId) + 1;
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
                                            case "FlowDescriptionReorganizationSuccess":
                                                return `Compacted ${flowDetails.description.compactionResult.originalBlocksCount} original blocks to ${flowDetails.description.compactionResult.resultingBlocksCount} resulting blocks`;

                                            case "FlowDescriptionReorganizationNothingToDo":
                                                return flowDetails.description.compactionResult.message;
                                            /* istanbul ignore next */
                                            default:
                                                return "Unknown compaction result typename";
                                        }

                                    case "FlowDescriptionDatasetReset":
                                        return "All dataset history has been cleared.";

                                    case "FlowDescriptionDatasetResetToMetadata":
                                        switch (flowDetails.description.resetToMetadataResult?.__typename) {
                                            case "FlowDescriptionReorganizationSuccess":
                                                return `All data except metadata has been deleted. Original blocks: ${flowDetails.description.resetToMetadataResult.originalBlocksCount}. Resulting blocks: ${flowDetails.description.resetToMetadataResult.resultingBlocksCount}`;

                                            case "FlowDescriptionReorganizationNothingToDo":
                                                return flowDetails.description.resetToMetadataResult.message;

                                            /* istanbul ignore next */
                                            default:
                                                return "Unknown compaction result typename";
                                        }

                                    case "FlowDescriptionWebhookDeliver":
                                        return (
                                            `Delivered message ${flowDetails.description.eventType} ` +
                                            (flowDetails.description.label.length > 0
                                                ? `via subscription "${flowDetails.description.label}"`
                                                : `to ${flowDetails.description.targetUrl}`)
                                        );

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

    private static describeActivationCause(activationCause: FlowActivationCause): string {
        switch (activationCause.__typename) {
            case "FlowActivationCauseAutoPolling":
                return "automatically";
            case "FlowActivationCauseManual":
                return "manually";
            case "FlowActivationCauseIterationFinished":
                return "by fetch source, as more data is available";
            case "FlowActivationCauseDatasetUpdate":
                switch (activationCause.source.__typename) {
                    case "FlowActivationCauseDatasetUpdateSourceUpstreamFlow":
                        return "after upstream flow event";
                    case "FlowActivationCauseDatasetUpdateSourceHttpIngest":
                        return "after HTTP push ingest event";
                    case "FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange":
                        return "after detected external change";
                    case "FlowActivationCauseDatasetUpdateSourceSmartProtocolPush":
                        return "after smart protocol push event";
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown activation cause data source");
                }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown activation cause typename");
        }
    }

    private static describeActivationCauseDetails(activationCause: FlowActivationCause): string {
        switch (activationCause.__typename) {
            case "FlowActivationCauseAutoPolling":
            case "FlowActivationCauseIterationFinished":
                return "";
            case "FlowActivationCauseManual":
                return `Triggered by <a class="fs-12" href="${DatasetFlowDetailsHelpers.accountHyperlink(activationCause.initiator.accountName)}">${activationCause.initiator.accountName}</a>`;
            case "FlowActivationCauseDatasetUpdate": {
                const datasetHyperlink = DatasetFlowDetailsHelpers.datasetHyperlink(
                    activationCause.dataset.owner.accountName,
                    activationCause.dataset.name,
                );
                const inputDatasetLink = `Input dataset: <a class="fs-12" href="${datasetHyperlink}">${activationCause.dataset.owner.accountName}/${activationCause.dataset.name}</a>`;
                switch (activationCause.source.__typename) {
                    case "FlowActivationCauseDatasetUpdateSourceUpstreamFlow": {
                        const flowHistoryHyperlink = DatasetFlowDetailsHelpers.flowHistoryHyperlink(
                            activationCause.dataset.owner.accountName,
                            activationCause.dataset.name,
                            activationCause.source.flowId,
                        );

                        const flowHistoryLink =
                            `<a class="fs-12" href="${flowHistoryHyperlink}">` +
                            `Flow #${activationCause.source.flowId}</a>`;
                        return `${flowHistoryLink}. ${inputDatasetLink}`;
                    }
                    case "FlowActivationCauseDatasetUpdateSourceHttpIngest":
                    case "FlowActivationCauseDatasetUpdateSourceSmartProtocolPush":
                    case "FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange":
                        return inputDatasetLink;

                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown activation cause data source");
                }
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown trigger typename");
        }
    }

    private static describeStartCondition(startConditionEvent: FlowEventStartConditionUpdated): string {
        switch (startConditionEvent.startCondition.__typename) {
            case "FlowStartConditionThrottling":
                return "throttling condition";
            case "FlowStartConditionReactive":
                return "reactive condition";
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

            case "FlowStartConditionReactive":
                switch (startCondition.activeBatchingRule.__typename) {
                    case "FlowTriggerBatchingRuleBuffering":
                        return `Accumulated ${startCondition.accumulatedRecordsCount}/${
                            startCondition.activeBatchingRule.minRecordsToAwait
                        } records. Watermark ${
                            startCondition.watermarkModified ? "modified" : "unchanged"
                        }. Deadline at ${format(startCondition.batchingDeadline, AppValues.CRON_EXPRESSION_DATE_FORMAT)}`; /* istanbul ignore next */

                    case "FlowTriggerBatchingRuleImmediate":
                        return "Waiting for input data";

                    default:
                        throw new Error("Unknown batching rule typename");
                }

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
        if (flowDetails.retryPolicy && flowDetails.taskIds[0] !== taskId) {
            const retryAttemptNo = flowDetails.taskIds.findIndex((id) => id === taskId);
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

    private static accountHyperlink(accountName: string): string {
        return `/${accountName}`;
    }

    private static datasetHyperlink(ownerName: string, datasetName: string): string {
        return `/${ownerName}/${datasetName}`;
    }

    private static flowHistoryHyperlink(ownerName: string, datasetName: string, flowId: string): string {
        return (
            `${DatasetFlowDetailsHelpers.datasetHyperlink(ownerName, datasetName)}/` +
            `${ProjectLinks.URL_FLOW_DETAILS}/${flowId}/${FlowDetailsTabs.HISTORY}`
        );
    }
}
