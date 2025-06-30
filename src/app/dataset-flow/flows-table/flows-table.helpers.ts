/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetListFlowsDataFragment,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import AppValues from "src/app/common/values/app.values";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { excludeAgoWord, isNil } from "../../common/helpers/app.helpers";
import { format } from "date-fns/format";
import { formatDistanceToNowStrict } from "date-fns";

export class DatasetFlowTableHelpers {
    public static descriptionColumnTableOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        switch (element.status) {
            case FlowStatus.Finished:
                /* istanbul ignore next */
                if (isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome?.__typename) {
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

            case FlowStatus.Retrying:
                return { icon: "restart_alt", class: "retrying-status" };

            case FlowStatus.Waiting:
                return { icon: "radio_button_checked", class: "waiting-status" };
        }
    }

    public static descriptionEndOfMessage(element: FlowSummaryDataFragment): string {
        switch (element.status) {
            case FlowStatus.Finished:
                /* istanbul ignore next */
                if (isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome?.__typename) {
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

            case FlowStatus.Retrying:
                return "retrying";

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
                if (isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome?.__typename) {
                    case "FlowSuccessResult":
                        switch (element.description.__typename) {
                            case "FlowDescriptionDatasetPollingIngest":
                            case "FlowDescriptionDatasetPushIngest":
                                return element.description.ingestResult?.__typename ===
                                    "FlowDescriptionUpdateResultUnknown"
                                    ? `${element.description.ingestResult.message}`
                                    : element.description.ingestResult?.__typename ===
                                        "FlowDescriptionUpdateResultSuccess"
                                      ? `Ingested ${element.description.ingestResult.numRecords} new ${
                                            element.description.ingestResult.numRecords == 1 ? "record" : "records"
                                        } in ${element.description.ingestResult.numBlocks} new ${
                                            element.description.ingestResult.numBlocks == 1 ? "block" : "blocks"
                                        }`
                                      : element.description.ingestResult?.__typename ===
                                              "FlowDescriptionUpdateResultUpToDate" &&
                                          element.description.ingestResult.uncacheable &&
                                          ((element.configSnapshot?.__typename === "FlowConfigRuleIngest" &&
                                              !element.configSnapshot.fetchUncacheable) ||
                                              !element.configSnapshot)
                                        ? `Source is uncacheable: to re-scan the data, use`
                                        : "Dataset is up-to-date";

                            case "FlowDescriptionDatasetExecuteTransform":
                                return element.description.transformResult?.__typename ===
                                    "FlowDescriptionUpdateResultUnknown"
                                    ? `${element.description.transformResult.message}`
                                    : element.description.transformResult?.__typename ===
                                        "FlowDescriptionUpdateResultSuccess"
                                      ? `Transformed ${element.description.transformResult.numRecords} new ${
                                            element.description.transformResult.numRecords == 1 ? "record" : "records"
                                        } in ${element.description.transformResult.numBlocks} new ${
                                            element.description.transformResult.numBlocks == 1 ? "block" : "blocks"
                                        }`
                                      : "Dataset is up-to-date";

                            case "FlowDescriptionDatasetHardCompaction":
                                switch (element.description.compactionResult?.__typename) {
                                    case "FlowDescriptionHardCompactionSuccess":
                                        if (
                                            element.configSnapshot?.__typename === "FlowConfigRuleCompaction" &&
                                            element.configSnapshot.compactionMode.__typename ===
                                                "FlowConfigCompactionModeMetadataOnly"
                                        ) {
                                            return "All data except metadata has been deleted";
                                        }
                                        return `Compacted ${element.description.compactionResult.originalBlocksCount} original blocks to ${element.description.compactionResult.resultingBlocksCount} resulting blocks`;

                                    case "FlowDescriptionHardCompactionNothingToDo":
                                        return element.description.compactionResult.message;
                                    /* istanbul ignore next */
                                    default:
                                        return "Unknown compaction result typename";
                                }

                            case "FlowDescriptionDatasetReset":
                                switch (element.description.__typename) {
                                    case "FlowDescriptionDatasetReset":
                                        return "All dataset history has been cleared";
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

                    case "FlowAbortedResult":
                        return `Aborted at ${format(
                            element.timing.finishedAt as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case "FlowFailedError": {
                        switch (element.outcome.reason.__typename) {
                            case "FlowFailureReasonGeneral":
                                return `An error occurred, see logs for more details`;
                            case "FlowFailureReasonInputDatasetCompacted": {
                                return `Input dataset <a class="text-small text-danger">${element.outcome.reason.inputDataset.name}</a> was hard compacted`;
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
            case FlowStatus.Retrying:
                switch (element.description.__typename) {
                    case "FlowDescriptionDatasetHardCompaction":
                        return "Running hard compaction";
                    case "FlowDescriptionDatasetPollingIngest":
                        /* istanbul ignore next */
                        if (isNil(fetchStep)) {
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
        /* istanbul ignore next */
        return "";
    }

    public static durationBlockText(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Waiting:
                switch (node.startCondition?.__typename) {
                    case "FlowStartConditionExecutor":
                        return `waiting for ${excludeAgoWord(formatDistanceToNowStrict(node.timing.awaitingExecutorSince as string, { addSuffix: true }))}`;
                    case "FlowStartConditionThrottling":
                    case "FlowStartConditionSchedule": {
                        return `wake up time: ${formatDistanceToNowStrict(node.startCondition.wakeUpAt, { addSuffix: true })}`;
                    }
                    case "FlowStartConditionBatching":
                        return `deadline time: ${formatDistanceToNowStrict(node.startCondition.batchingDeadline, { addSuffix: true })}`;
                    /* istanbul ignore next */
                    default:
                        return "initializing...";
                }
            case FlowStatus.Running:
                return (
                    "running for " +
                    excludeAgoWord(formatDistanceToNowStrict(node.timing.runningSince as string, { addSuffix: true }))
                );
            case FlowStatus.Retrying:
                return (
                    "retrying in " +
                    excludeAgoWord(formatDistanceToNowStrict(node.timing.scheduledAt as string, { addSuffix: true }))
                );
            case FlowStatus.Finished:
                switch (node.outcome?.__typename) {
                    case "FlowSuccessResult":
                        return (
                            "finished " +
                            formatDistanceToNowStrict(node.timing.finishedAt as string, { addSuffix: true })
                        );
                    case "FlowAbortedResult":
                        return (
                            "aborted " +
                            formatDistanceToNowStrict(node.timing.finishedAt as string, { addSuffix: true })
                        );
                    case "FlowFailedError":
                        return (
                            "failed " +
                            formatDistanceToNowStrict(node.timing.runningSince as string, { addSuffix: true })
                        );
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
            /* istanbul ignore next */
            default:
                return "waiting...";
        }
    }

    public static tooltipText(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Waiting:
                switch (node.startCondition?.__typename) {
                    case "FlowStartConditionExecutor":
                        return `waiting for: ${excludeAgoWord(
                            format(node.timing.awaitingExecutorSince as string, AppValues.CRON_EXPRESSION_DATE_FORMAT),
                        )}`;
                    case "FlowStartConditionThrottling":
                    case "FlowStartConditionSchedule": {
                        return `Wake up time: ${format(
                            node.startCondition.wakeUpAt,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    }
                    case "FlowStartConditionBatching":
                        return `Deadline time: ${format(
                            node.startCondition.batchingDeadline,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    /* istanbul ignore next */
                    default:
                        return "";
                }
            case FlowStatus.Finished:
                switch (node.outcome?.__typename) {
                    case "FlowSuccessResult":
                        return `Completed time: ${format(
                            node.timing.finishedAt as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowAbortedResult":
                        return `Aborted time: ${format(
                            node.timing.finishedAt as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowFailedError":
                        return `Start running time: ${format(
                            node.timing.runningSince as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    /* istanbul ignore next */
                    default:
                        throw new Error("Unknown flow outcome");
                }

            case FlowStatus.Running:
                return `Start running time: ${format(
                    node.timing.runningSince as string,
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}`;

            case FlowStatus.Retrying:
                return `Planned retry time: ${format(
                    node.timing.scheduledAt as string,
                    AppValues.CRON_EXPRESSION_DATE_FORMAT,
                )}`;
            /* istanbul ignore next */
            default:
                throw new Error("Unknown flow status");
        }
    }
}
