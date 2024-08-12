import _ from "lodash";
import moment from "moment";
import {
    DatasetListFlowsDataFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
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
        datasets: DatasetListFlowsDataFragment[],
        datasetId: string,
    ): string {
        const datasetWithFlow = datasets.find((dataset) => dataset.id === datasetId);
        const fetchStep = datasetWithFlow?.metadata.currentPollingSource?.fetch;
        const transformData = datasetWithFlow?.metadata.currentTransform;
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

                            case "FlowDescriptionDatasetHardCompaction":
                                switch (element.description.compactionResult?.__typename) {
                                    case "FlowDescriptionHardCompactionSuccess":
                                        return `Compacted ${element.description.compactionResult.originalBlocksCount} original blocks to ${element.description.compactionResult.resultingBlocksCount} resulting blocks`;

                                    case "FlowDescriptionHardCompactionNothingToDo":
                                        return element.description.compactionResult.message;
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown compaction result typename";
                                }
                            // TODO
                            //  - GC
                            default:
                                return "Unknown description typename";
                        }

                    case "FlowAbortedResult":
                        return `Aborted at ${moment(element.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case "FlowFailedError": {
                        switch (element.outcome.reason.__typename) {
                            case "FlowFailedMessage":
                                return `An error occurred, see logs for more details`;
                            case "FlowDatasetCompactedFailedError": {
                                return `Input dataset <a class="text-small text-danger">${element.outcome.reason.rootDataset.name}</a> was hard compacted`;
                            }
                            /* istanbul ignore next */
                            default:
                                return "Unknown flow failed error";
                        }
                    }

                    /* istanbul ignore next */
                    default:
                        throw new Error("Unsupported flow outcome");
                }

            case FlowStatus.Waiting:
            case FlowStatus.Running:
                switch (element.description.__typename) {
                    case "FlowDescriptionDatasetHardCompaction":
                        return "Running hard compaction";
                    case "FlowDescriptionDatasetPollingIngest":
                        /* istanbul ignore next */
                        if (_.isNil(fetchStep)) {
                            throw new Error("FetchStep expected for polling ingest flow");
                        }
                        switch (fetchStep?.__typename) {
                            case "FetchStepUrl":
                                return `Polling data from url: ${fetchStep.url}`;
                            case "FetchStepContainer":
                                return `Polling data from image: ${fetchStep.image}`;
                            case "FetchStepFilesGlob":
                                return `Polling data from file: ${fetchStep.path}`;
                        }
                        break;
                    case "FlowDescriptionDatasetExecuteTransform": {
                        const engineDesc = DataHelpers.descriptionForEngine(transformData?.transform.engine ?? "");
                        return `Transforming ${transformData?.inputs.length} input datasets using "${
                            engineDesc.label ?? engineDesc.name
                        }" engine`;
                    }
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
