import _ from "lodash";
import moment from "moment";
import { FetchStep, FlowStartCondition, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { TransformDescriptionTableData } from "./flows-table.types";
import { DataHelpers } from "src/app/common/data.helpers";

export class DatasetFlowTableHelpers {
    public static descriptionColumnTableOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        switch (element.status) {
            case FlowStatus.Finished:
                /* istanbul ignore next */
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome.__typename) {
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

            case FlowStatus.Running:
                return { icon: "radio_button_checked", class: "running-status" };

            case FlowStatus.Waiting:
                return { icon: "radio_button_checked", class: "waiting-status" };
        }
    }

    public static descriptionEndOfMessage(element: FlowSummaryDataFragment): string {
        switch (element.status) {
            case FlowStatus.Finished:
                /* istanbul ignore next */
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome.__typename) {
                    case "FlowSuccessResult":
                        return "finished";
                    case "FlowAbortedResult":
                        return "aborted";
                    case "FlowFailedError":
                        return "failed";
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unsupported flow outcome");
                }

            case FlowStatus.Running:
                return "running";

            case FlowStatus.Waiting:
                return "waiting";
            /* istanbul ignore next */
            default:
                throw new Error(`Unsupported flow status`);
        }
    }

    public static descriptionSubMessage(
        element: FlowSummaryDataFragment,
        fetchStep: MaybeUndefined<FetchStep>,
        transformData: TransformDescriptionTableData,
    ): string {
        switch (element.status) {
            case FlowStatus.Finished:
                /* istanbul ignore next */
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome.__typename) {
                    case "FlowSuccessResult":
                        switch (element.description.__typename) {
                            case "FlowDescriptionDatasetPollingIngest":
                            case "FlowDescriptionDatasetPushIngest":
                                return element.description.ingestResult
                                    ? `Ingested ${element.description.ingestResult.numRecords} new ${
                                          element.description.ingestResult.numRecords == 1 ? "record" : "records"
                                      } in ${element.description.ingestResult.numBlocks} new ${
                                          element.description.ingestResult.numBlocks == 1 ? "block" : "blocks"
                                      }`
                                    : "Dataset is up-to-date";

                            case "FlowDescriptionDatasetExecuteTransform":
                                return element.description.transformResult
                                    ? `Transformed ${element.description.transformResult.numRecords} new ${
                                          element.description.transformResult.numRecords == 1 ? "record" : "records"
                                      } in ${element.description.transformResult.numBlocks} new ${
                                          element.description.transformResult.numBlocks == 1 ? "block" : "blocks"
                                      }`
                                    : "Dataset is up-to-date";
                            // TODO
                            //  - Compacting
                            //  - GC
                            default:
                                return "Unknown description typename";
                        }

                    case "FlowAbortedResult":
                        return `Aborted at ${moment(element.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case "FlowFailedError":
                        return `An error occurred, see logs for more details`;
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unsupported flow outcome");
                }

            case FlowStatus.Waiting:
            case FlowStatus.Running:
                switch (element.description.__typename) {
                    case "FlowDescriptionDatasetPollingIngest":
                        /* istanbul ignore next */
                        if (_.isNil(fetchStep)) {
                            throw new Error("FetchStep expected for polling ingest flow");
                        }
                        switch (fetchStep.__typename) {
                            case "FetchStepUrl":
                                return `Polling data from url: ${fetchStep.url}`;
                            case "FetchStepContainer":
                                return `Polling data from image: ${fetchStep.image}`;
                            case "FetchStepFilesGlob":
                                return `Polling data from file: ${fetchStep.path}`;
                        }
                        break;
                    case "FlowDescriptionDatasetExecuteTransform":
                        return `Transforming ${transformData.numInputs} input datasets using "${
                            DataHelpers.descriptionForEngine(transformData.engine).label ?? "unknown"
                        }" engine`;
                    // TODO: consider what to display for other flow types
                    //  - push ingest
                    //  - compacting
                    //  - GC
                }
        }

        return "";
    }

    public static durationBlockText(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Waiting:
                switch (node.startCondition?.__typename) {
                    case "FlowStartConditionExecutor":
                        return `awaiting since ${moment(node.timing.awaitingExecutorSince ?? "").fromNow()}`;
                    case "FlowStartConditionThrottling":
                    case "FlowStartConditionSchedule": {
                        return `wake up time: ${moment(node.startCondition.wakeUpAt).fromNow()}`;
                    }
                    case "FlowStartConditionBatching":
                        return `deadline time: ${moment(node.startCondition.batchingDeadline).fromNow()}`;
                    default:
                        return "";
                }
            case FlowStatus.Running:
                return "running since " + moment(node.timing.runningSince).fromNow();
            case FlowStatus.Finished:
                switch (node.outcome?.__typename) {
                    case "FlowSuccessResult":
                        return "finished " + moment(node.timing.finishedAt).fromNow();
                    case "FlowAbortedResult":
                        return "aborted " + moment(node.timing.finishedAt).fromNow();
                    case "FlowFailedError":
                        return "failed " + moment(node.timing.runningSince).fromNow();
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown flow outsome");
                }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown flow status");
        }
    }

    public static waitingBlockText(startCondition: MaybeNull<FlowStartCondition>): string {
        switch (startCondition?.__typename) {
            case "FlowStartConditionThrottling":
                return "waiting for a throttling condition";

            case "FlowStartConditionBatching":
                return "waiting for a batching condition";

            case "FlowStartConditionExecutor": {
                return "waiting for a free executor";
            }
            case "FlowStartConditionSchedule":
                return "waiting for scheduled execution";

            default:
                return "";
        }
    }

    public static tooltipText(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Waiting:
                switch (node.startCondition?.__typename) {
                    case "FlowStartConditionExecutor":
                        return `awaiting since: ${moment(node.timing.awaitingExecutorSince ?? "").format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowStartConditionThrottling":
                    case "FlowStartConditionSchedule": {
                        return `Wake up time: ${moment(node.startCondition.wakeUpAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    }
                    case "FlowStartConditionBatching":
                        return `Deadline time: ${moment(node.startCondition.batchingDeadline).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    default:
                        return "";
                }
            case FlowStatus.Finished:
                switch (node.outcome?.__typename) {
                    case "FlowSuccessResult":
                        return `Completed time: ${moment(node.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowAbortedResult":
                        return `Aborted time: ${moment(node.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowFailedError":
                        return `Start running time: ${moment(node.timing.runningSince).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown flow outcome");
                }

            case FlowStatus.Running:
                return `Start running time: ${moment(node.timing.runningSince).format(
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}`;
            /* istanbul ignore next */
            default:
                throw new Error("Unknown flow status");
        }
    }
}
