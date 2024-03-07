import moment from "moment";
import {
    FlowEventInitiated,
    FlowEventStartConditionUpdated,
    FlowEventTaskChanged,
    FlowEventTriggerAdded,
    FlowHistoryDataFragment,
    FlowOutcome,
    FlowStartConditionBatching,
    FlowStartConditionKind,
    FlowStartConditionThrottling,
    FlowSummaryDataFragment,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";
import { DataHelpers } from "src/app/common/data.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";

export class DatasetFlowDetailsHelpers {
    public static flowEventDescription(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
    ): string {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated": {
                const triggerTypename = (flowEvent as FlowEventInitiated).trigger.__typename;
                switch (triggerTypename) {
                    case "FlowTriggerAutoPolling":
                        return `Event initiated by auto polling trigger`;
                    case "FlowTriggerManual":
                        return `Event initiated by manual trigger`;
                    case "FlowTriggerPush":
                        return `Event initiated by push trigger`;
                    case "FlowTriggerInputDatasetFlow":
                        return `Event initiated by input dataset`;
                    default:
                        throw new Error("Unknown trigger typename");
                }
            }
            case "FlowEventAborted":
                return "Event was aborted";
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                return `${DataHelpers.flowTypeDescription(
                    flowDetails,
                )} ${DatasetFlowDetailsHelpers.descriptionEndOfMessage(event)}`;
            }
            case "FlowEventTriggerAdded": {
                const triggerTypename = (flowEvent as FlowEventTriggerAdded).trigger.__typename;
                switch (triggerTypename) {
                    case "FlowTriggerAutoPolling":
                        return `Event initiated by auto polling trigger`;
                    case "FlowTriggerManual":
                        return `Event initiated by manual trigger`;
                    case "FlowTriggerPush":
                        return `Event initiated by push trigger`;
                    case "FlowTriggerInputDatasetFlow":
                        return `Event initiated by input dataset`;
                    default:
                        throw new Error("Unknown trigger typename");
                }
            }
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                switch (startConditionEvent.startConditionKind) {
                    case FlowStartConditionKind.Throttling:
                        return `Waiting for throttling condition`;
                    case FlowStartConditionKind.Batching:
                        return `Waiting for batching condition`;
                    case FlowStartConditionKind.Executor:
                        return `Waiting for executor`;
                    case FlowStartConditionKind.Schedule:
                        return `Waiting for schedule`;
                    default:
                        return "Unknown start condition typename";
                }
            }
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
            // case "FlowEventQueued":
            //     return { icon: "radio_button_checked", class: "queued-status" };

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
                        switch (flowDetails.outcome) {
                            case FlowOutcome.Success:
                                return { icon: "check_circle", class: "completed-status" };
                            case FlowOutcome.Failed:
                                return { icon: "dangerous", class: "failed-status" };
                            case FlowOutcome.Aborted:
                                return { icon: "cancel", class: "aborted-outcome" };

                            default:
                                throw new Error("Unsupported flow outcome");
                        }
                    case TaskStatus.Queued:
                        return { icon: "radio_button_checked", class: "scheduled-status" };
                    case TaskStatus.Running:
                        return { icon: "radio_button_checked", class: "running-status" };
                    default:
                        throw new Error("Unsupported flow event typename");
                }
            }
            default:
                throw new Error("Unsupported flow event typename");
        }
    }

    public static flowEventSubMessage(
        flowEvent: FlowHistoryDataFragment,
        flowDetails: FlowSummaryDataFragment,
        inputDatasetInfo: DatasetInfo,
    ): string {
        const eventTypename = flowEvent.__typename;
        switch (eventTypename) {
            case "FlowEventInitiated": {
                const triggerTypename = (flowEvent as FlowEventInitiated).trigger.__typename;
                switch (triggerTypename) {
                    case "FlowTriggerAutoPolling":
                        return `Initiated by system process`;
                    case "FlowTriggerManual":
                        return `Initiated by account name: ${
                            flowDetails.initiator?.accountName ?? "unknown account name"
                        }`;
                    case "FlowTriggerPush":
                        return `Initiated by push trigger`;
                    case "FlowTriggerInputDatasetFlow": {
                        return `Input dataset: ${inputDatasetInfo.accountName}/${inputDatasetInfo.datasetName}`;
                    }
                    default:
                        throw new Error("Unknown trigger typename");
                }
            }
            case "FlowEventAborted":
                return "Event was aborted";
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                switch (event.taskStatus) {
                    case TaskStatus.Queued:
                    case TaskStatus.Running:
                        return `Status changed`;
                    case TaskStatus.Finished:
                        switch (flowDetails.outcome) {
                            case FlowOutcome.Failed:
                                return `An error occurred, see logs for more details`;
                            case FlowOutcome.Success:
                                switch (flowDetails.description.__typename) {
                                    case "FlowDescriptionDatasetPollingIngest":
                                    case "FlowDescriptionDatasetPushIngest":
                                        return flowDetails.description.ingestResult
                                            ? `Ingested ${flowDetails.description.ingestResult.numRecords} new ${
                                                  flowDetails.description.ingestResult.numRecords == 1
                                                      ? "record"
                                                      : "records"
                                              } in ${flowDetails.description.ingestResult.numBlocks} new ${
                                                  flowDetails.description.ingestResult.numBlocks == 1
                                                      ? "block"
                                                      : "blocks"
                                              }`
                                            : "Expected to have injest result";

                                    case "FlowDescriptionDatasetExecuteTransform":
                                        return flowDetails.description.transformResult
                                            ? `Transformed ${flowDetails.description.transformResult.numRecords} new ${
                                                  flowDetails.description.transformResult.numRecords == 1
                                                      ? "record"
                                                      : "records"
                                              } in ${flowDetails.description.transformResult.numBlocks} new ${
                                                  flowDetails.description.transformResult.numBlocks == 1
                                                      ? "block"
                                                      : "blocks"
                                              }`
                                            : "Expected to have transform result";
                                    // TODO
                                    //  - Compacting
                                    //  - GC
                                    default:
                                        return "Unknown description typename";
                                }

                            default:
                                throw new Error("Unknown flow outcome");
                        }
                    default:
                        throw new Error("Unknown task status");
                }
            }
            case "FlowEventTriggerAdded": {
                const triggerTypename = (flowEvent as FlowEventTriggerAdded).trigger.__typename;
                switch (triggerTypename) {
                    case "FlowTriggerAutoPolling":
                        return `Event initiated by auto polling trigger`;
                    case "FlowTriggerManual":
                        return `Event initiated by manual trigger`;
                    case "FlowTriggerPush":
                        return `Event initiated by push trigger`;
                    case "FlowTriggerInputDatasetFlow":
                        return `Event initiated by input dataset`;
                    default:
                        throw new Error("Unknown trigger typename");
                }
            }
            case "FlowEventStartConditionUpdated": {
                const startConditionEvent = flowEvent as FlowEventStartConditionUpdated;
                switch (startConditionEvent.startConditionKind) {
                    case FlowStartConditionKind.Throttling: {
                        const startCondition = flowDetails.startCondition as FlowStartConditionThrottling;
                        return `Throttling interval: ${startCondition.intervalSec} sec`;
                    }
                    case FlowStartConditionKind.Batching: {
                        const startCondition = flowDetails.startCondition as FlowStartConditionBatching;
                        return `Batching deadline ${moment(startCondition.batchingDeadline).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    }
                    // TODO:
                    case FlowStartConditionKind.Executor:
                        return "executor";
                    case FlowStartConditionKind.Schedule:
                        return "schedule";
                    default:
                        return "Unknown start condition typename";
                }
            }
            default:
                throw new Error("Unknown event typename");
        }
    }

    public static descriptionEndOfMessage(element: FlowEventTaskChanged): string {
        switch (element.taskStatus) {
            case TaskStatus.Finished:
                return "finished";
            case TaskStatus.Queued:
                return "queued";
            case TaskStatus.Running:
                return "running";
            default:
                throw new Error(`Unsupported task status`);
        }
    }
}
