/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
    FlowTimingRecords,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";
import AppValues from "src/app/common/values/app.values";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
import { excludeAgoWord, isNil, pluralize } from "../../common/helpers/app.helpers";
import { format } from "date-fns/format";
import { formatDistanceToNowStrict } from "date-fns";

export class FlowTableHelpers {
    public static flowTypeDescription(flow: FlowSummaryDataFragment): string {
        const decriptionFlow = flow.description;
        switch (decriptionFlow.__typename) {
            case "FlowDescriptionDatasetPollingIngest":
                return `Polling ingest`;
            case "FlowDescriptionDatasetPushIngest":
                return `Push ingest`;
            case "FlowDescriptionDatasetExecuteTransform":
                return `Execute transformation`;
            case "FlowDescriptionDatasetHardCompaction":
                if (
                    flow.configSnapshot?.__typename === "FlowConfigRuleCompaction" &&
                    flow.configSnapshot.compactionMode.__typename === "FlowConfigCompactionModeMetadataOnly"
                ) {
                    return "Reset";
                }
                return `Hard compaction`;
            case "FlowDescriptionSystemGC":
                return `Garbage collector`;
            case "FlowDescriptionDatasetReset":
                return `Reset to seed`;
            /* istanbul ignore next */
            default:
                return "Unsupported flow description";
        }
    }

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
                return { icon: "radio_button_checked", class: "retrying-status" };

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
                return "awaiting retry";

            case FlowStatus.Waiting:
                return "waiting";

            /* istanbul ignore next */
            default:
                throw new Error(`Unsupported flow status`);
        }
    }

    public static descriptionSubMessage(element: FlowSummaryDataFragment): string {
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
                                      ? `Ingested ${element.description.ingestResult.numRecords} new ${pluralize(
                                            "record",
                                            element.description.ingestResult.numRecords,
                                        )} in ${element.description.ingestResult.numBlocks} new ${pluralize(
                                            "block",
                                            element.description.ingestResult.numBlocks,
                                        )}`
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
                                      ? `Transformed ${element.description.transformResult.numRecords} new ${pluralize(
                                            "record",
                                            element.description.transformResult.numRecords,
                                        )} in ${element.description.transformResult.numBlocks} new ${pluralize(
                                            "block",
                                            element.description.transformResult.numBlocks,
                                        )}`
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
                            element.timing.lastAttemptFinishedAt as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case "FlowFailedError": {
                        switch (element.outcome.reason.__typename) {
                            case "TaskFailureReasonGeneral":
                                return `An error occurred, see logs for more details`;
                            case "TaskFailureReasonInputDatasetCompacted": {
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
                        {
                            const fetchStep = element.description.pollingSource.fetch;
                            switch (fetchStep?.__typename) {
                                case "FetchStepUrl":
                                    return `Polling data from url: ${fetchStep.url}`;
                                case "FetchStepContainer":
                                    return `Polling data from image: ${fetchStep.image}`;
                                case "FetchStepFilesGlob":
                                    return `Polling data from file: ${fetchStep.path}`;
                            }
                        }
                        break;
                    case "FlowDescriptionDatasetExecuteTransform": {
                        const transformData = element.description.transform;
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
                    "retrying " +
                    excludeAgoWord(formatDistanceToNowStrict(node.timing.scheduledAt as string, { addSuffix: true }))
                );
            case FlowStatus.Finished:
                switch (node.outcome?.__typename) {
                    case "FlowSuccessResult":
                        return (
                            "finished " +
                            formatDistanceToNowStrict(node.timing.lastAttemptFinishedAt as string, { addSuffix: true })
                        );
                    case "FlowAbortedResult":
                        return (
                            "aborted " +
                            formatDistanceToNowStrict(node.timing.lastAttemptFinishedAt as string, { addSuffix: true })
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

    public static durationTimingText(flowNode: { timing: FlowTimingRecords; outcome?: MaybeNull<object> }): string {
        if (flowNode.outcome) {
            if (flowNode.timing.lastAttemptFinishedAt) {
                return DataHelpers.durationTask(flowNode.timing.initiatedAt, flowNode.timing.lastAttemptFinishedAt);
            } else {
                // Aborted?
                return "-";
            }
        } else {
            return DataHelpers.durationTask(flowNode.timing.initiatedAt, new Date().toISOString());
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

    public static retriesBlockText(flowStatus: FlowStatus, tasksInFlow: number, maxRetryAttempts: number): string {
        switch (flowStatus) {
            case FlowStatus.Running:
            case FlowStatus.Retrying:
                return `retry attempt ${tasksInFlow} of ${maxRetryAttempts}`;

            case FlowStatus.Finished: // failure is assumed, otherwise there is no retry block
                return `failed after ${maxRetryAttempts} retry attempts`;

            default:
                throw new Error('Retries block is only applicable for "Retrying" or "Finished" flow statuses');
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
                            node.timing.lastAttemptFinishedAt as string,
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;
                    case "FlowAbortedResult":
                        return `Aborted time: ${format(
                            node.timing.lastAttemptFinishedAt as string,
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
