import _ from "lodash";
import moment from "moment";
import {
    FetchStep,
    FlowOutcome,
    FlowStartCondition,
    FlowStatus,
    FlowSummaryDataFragment,
} from "src/app/api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { TransformDescriptionTableData } from "./flows-table.types";
import { DataHelpers } from "src/app/common/data.helpers";

export class DatasetFlowTableHelpers {
    public static descriptionColumnTableOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        switch (element.status) {
            case FlowStatus.Finished:
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome) {
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

            case FlowStatus.Running:
                return { icon: "radio_button_checked", class: "running-status" };

            case FlowStatus.Waiting:
                return { icon: "radio_button_checked", class: "waiting-status" };
        }

        return { icon: "question_mark", class: "" };
    }

    public static descriptionEndOfMessage(element: FlowSummaryDataFragment): string {
        switch (element.status) {
            case FlowStatus.Finished:
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome) {
                    case FlowOutcome.Success:
                        return "finished";
                    case FlowOutcome.Aborted:
                        return "aborted";
                    case FlowOutcome.Failed:
                        return "failed";
                    case FlowOutcome.Cancelled:
                        return "cancelled";
                    default:
                        throw new Error("Unsupported flow outcome");
                }

            case FlowStatus.Running:
                return "running";

            case FlowStatus.Waiting:
                return "waiting";

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
                if (_.isNil(element.outcome)) {
                    throw new Error("Expected to have flow outcome in Finished state");
                }
                switch (element.outcome) {
                    case FlowOutcome.Success:
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

                    case FlowOutcome.Cancelled:
                        return `Cancelled at ${moment(element.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case FlowOutcome.Aborted:
                        return `Aborted at ${moment(element.timing.finishedAt).format(
                            AppValues.CRON_EXPRESSION_DATE_FORMAT,
                        )}`;

                    case FlowOutcome.Failed:
                        return `An error occurred, see logs for more details`;
                    default:
                        throw new Error("Unknown flow outcome");
                }

            case FlowStatus.Waiting:
            case FlowStatus.Running:
                switch (element.description.__typename) {
                    case "FlowDescriptionDatasetPollingIngest":
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

    public static waitingBlockText(startCondition: MaybeNull<FlowStartCondition>): string {
        switch (startCondition?.__typename) {
            case "FlowStartConditionThrottling":
                return "waiting for throttling condition";

            case "FlowStartConditionBatching":
                return "waiting for batching condition";

            case "FlowStartConditionExecutor": {
                return "waiting for a free executor";
            }
            case "FlowStartConditionSchedule":
                return "waiting for scheduled execution";

            default:
                return "";
        }
    }
}
