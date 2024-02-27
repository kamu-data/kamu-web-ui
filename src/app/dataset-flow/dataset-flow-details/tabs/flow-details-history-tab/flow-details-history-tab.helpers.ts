import moment from "moment";
import {
    FlowEventInitiated,
    FlowEventQueued,
    FlowEventStartConditionDefined,
    FlowEventTaskChanged,
    FlowEventTriggerAdded,
    FlowHistoryDataFragment,
    FlowOutcome,
    FlowSummaryDataFragment,
    TaskStatus,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";

export class DatasetFlowDetailsHelpers {
    public static flowEventDescription(flowEvent: FlowHistoryDataFragment): string {
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
            case "FlowEventQueued":
                return `Event is in queue`;
            case "FlowEventTaskChanged":
                return `The event changed status`;
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
            case "FlowEventStartConditionDefined": {
                const startConditionEvent = flowEvent as FlowEventStartConditionDefined;
                switch (startConditionEvent.startCondition.__typename) {
                    case "FlowStartConditionThrottling":
                        return `Waiting for throttling condition`;
                    case "FlowStartConditionBatching":
                        return `Waiting for batching condition`;
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
            case "FlowEventQueued":
                return { icon: "radio_button_checked", class: "queued-status" };

            case "FlowEventAborted":
                return { icon: "cancel", class: "aborted-outcome" };
            case "FlowEventTriggerAdded":
                return { icon: "add_circle", class: "text-muted" };
            case "FlowEventStartConditionDefined":
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
                            case FlowOutcome.Cancelled:
                                return { icon: "cancel", class: "cancelled-outcome" };

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
                    case "FlowTriggerInputDatasetFlow":
                        return `Initiated by input dataset`;
                    default:
                        throw new Error("Unknown trigger typename");
                }
            }
            case "FlowEventAborted":
                return "Event was aborted";
            case "FlowEventQueued": {
                const event = flowEvent as FlowEventQueued;
                return `Activation time at ${moment(event.activateAt).format(AppValues.CRON_EXPRESSION_DATE_FORMAT)}`;
            }
            case "FlowEventTaskChanged": {
                const event = flowEvent as FlowEventTaskChanged;
                return `Status changed to ${event.taskStatus}`;
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
            case "FlowEventStartConditionDefined": {
                const startConditionEvent = flowEvent as FlowEventStartConditionDefined;
                switch (startConditionEvent.startCondition.__typename) {
                    case "FlowStartConditionThrottling":
                        return `Throttling interval:${startConditionEvent.startCondition.intervalSec} sec`;
                    case "FlowStartConditionBatching":
                        return `Threhold new record(s):${startConditionEvent.startCondition.thresholdNewRecords} record(s)`;
                    default:
                        return "Unknown start condition typename";
                }
            }
            default:
                throw new Error("Unknown event typename");
        }
    }
}
