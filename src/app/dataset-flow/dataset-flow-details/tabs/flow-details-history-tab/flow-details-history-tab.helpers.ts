import moment from "moment";
import {
    FlowEventInitiated,
    FlowEventStartConditionUpdated,
    FlowEventTaskChanged,
    FlowEventTriggerAdded,
    FlowHistoryDataFragment,
    FlowOutcomeDataFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowTrigger,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";

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
                return `${DataHelpers.flowTypeDescription(
                    flowDetails,
                )} task ${DatasetFlowDetailsHelpers.descriptionEndOfMessage(event)}`;
            }
            case "FlowEventTriggerAdded":
                return `Additionally triggered ${this.describeTrigger((flowEvent as FlowEventTriggerAdded).trigger)}`;
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                return `Waiting for ${this.describeStartCondition(startConditionEvent)}`;
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown event typename");
        }
    }

    public static flowEventIconOptions(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): { icon: string; class: string } {
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
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                switch (event.taskStatus) {
                    case TaskStatus.Finished:
                        return DatasetFlowDetailsHelpers.flowOutcomeOptions(
                            flowDetails.outcome as FlowOutcomeDataFragment,
                        );
                    case TaskStatus.Queued:
                        return { icon: "radio_button_checked", class: "scheduled-status" };
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
            case "FlowEventAborted":
                return "";
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                switch (event.taskStatus) {
                    case TaskStatus.Running:
                        return `Task #${flowEvent.taskId}`;
                    case TaskStatus.Finished:
                        switch (flowDetails.outcome?.__typename) {
                            case "FlowFailedError":
                                switch (flowDetails.outcome.reason.__typename) {
                                    case "FlowFailureReasonGeneral":
                                        return `An error occurred, see logs for more details`;
                                    case "FlowFailureReasonInputDatasetCompacted":
                                        return `Root dataset <span class="text-small text-danger">${flowDetails.outcome.reason.inputDataset.name}</span> was compacted`;
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown flow failed error";
                                }
                            case "FlowSuccessResult":
                                switch (flowDetails.description.__typename) {
                                    case "FlowDescriptionDatasetPollingIngest":
                                    case "FlowDescriptionDatasetPushIngest":
                                        return flowDetails.description.ingestResult?.__typename ===
                                            "FlowDescriptionUpdateResultSuccess"
                                            ? `Ingested ${flowDetails.description.ingestResult.numRecords} new ${
                                                  flowDetails.description.ingestResult.numRecords == 1
                                                      ? "record"
                                                      : "records"
                                              } in ${flowDetails.description.ingestResult.numBlocks} new ${
                                                  flowDetails.description.ingestResult.numBlocks == 1
                                                      ? "block"
                                                      : "blocks"
                                              }`
                                            : flowDetails.description.ingestResult?.__typename ===
                                                    "FlowDescriptionUpdateResultUpToDate" &&
                                                flowDetails.description.ingestResult.uncacheable &&
                                                flowDetails.configSnapshot?.__typename === "FlowConfigurationIngest" &&
                                                !flowDetails.configSnapshot.fetchUncacheable &&
                                                // TODO: Remove this condition
                                                flowDetails.configSnapshot
                                              ? // TODO: Replace when will be new API
                                                // ||
                                                //     !flowDetails.configSnapshot)
                                                "Source is uncacheable: to re-scan the data, use force update"
                                              : "Dataset is up-to-date";

                                    case "FlowDescriptionDatasetExecuteTransform":
                                        return flowDetails.description.transformResult?.__typename ===
                                            "FlowDescriptionUpdateResultSuccess"
                                            ? `Transformed ${flowDetails.description.transformResult.numRecords} new ${
                                                  flowDetails.description.transformResult.numRecords == 1
                                                      ? "record"
                                                      : "records"
                                              } in ${flowDetails.description.transformResult.numBlocks} new ${
                                                  flowDetails.description.transformResult.numBlocks == 1
                                                      ? "block"
                                                      : "blocks"
                                              }`
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
                return this.describeStartConditionDetails(startConditionEvent);
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown event typename");
        }
    }

    public static descriptionEndOfMessage(element: FlowEventTaskChanged): string {
        switch (element.taskStatus) {
            case TaskStatus.Finished:
                return "finished";
            case TaskStatus.Running:
                return "running";
            /* istanbul ignore next */
            default:
                throw new Error(`Unsupported task status`);
        }
    }

    private static describeTrigger(trigger: FlowTrigger): string {
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

    private static describeTriggerDetails(trigger: FlowTrigger): string {
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

    private static describeStartConditionDetails(startConditionEvent: FlowEventStartConditionUpdated): string {
        const startCondition: FlowStartCondition = startConditionEvent.startCondition;
        switch (startCondition.__typename) {
            case "FlowStartConditionThrottling":
                return `Wake up time at ${moment(startCondition.wakeUpAt).format(
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}, shifted from ${moment(startCondition.shiftedFrom).format(AppValues.TIME_FORMAT)}`;
            case "FlowStartConditionBatching":
                return `Accumulated ${startCondition.accumulatedRecordsCount}/${
                    startCondition.activeTransformRule.minRecordsToAwait
                } records. Watermark ${
                    startCondition.watermarkModified ? "modified" : "unchanged"
                }. Deadline at ${moment(startCondition.batchingDeadline).format(
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}`;
            case "FlowStartConditionExecutor":
                return `Task #${startCondition.taskId}`;
            case "FlowStartConditionSchedule":
                return `Wake up time at ${moment(startCondition.wakeUpAt).format(
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}`;
            /* istanbul ignore next */
            default:
                throw new Error("Unknown start condition typename");
        }
    }

    public static dynamicImgSrc(status: FlowStatus): string {
        switch (status) {
            case FlowStatus.Running:
                return "assets/images/gear.gif";
            case FlowStatus.Waiting:
                return "assets/images/hourglass.gif";
            default:
                return "";
        }
    }
}
