import _ from "lodash";
import moment from "moment";
import { FetchStep, FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";

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
                    case FlowOutcome.Cancelled:
                        return { icon: "cancel", class: "aborted-outcome" };

                    default:
                        throw new Error("Unsupported flow outcome");
                }

            case FlowStatus.Queued:
                return { icon: "radio_button_checked", class: "queued-status" };

            case FlowStatus.Running:
                return { icon: "radio_button_checked", class: "running-status" };

            case FlowStatus.Scheduled:
                return { icon: "radio_button_checked", class: "scheduled-status" };

            // TODO: Waiting status?
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

            case FlowStatus.Queued:
                return "queued";

            case FlowStatus.Running:
                return "running";

            case FlowStatus.Scheduled:
                return "scheduled";

            case FlowStatus.Waiting:
                return "waiting";

            default:
                throw new Error(`Unsupported flow status`);
        }
    }

    public static descriptionSubMessage(
        element: FlowSummaryDataFragment,
        fetchStep: MaybeUndefined<FetchStep>,
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
                                if (_.isNil(element.description.ingestResult)) {
                                    throw new Error("Expected to have injest result");
                                }
                                return `Ingested ${element.description.ingestResult.numRecords} new ${
                                    element.description.ingestResult.numRecords == 1 ? "record" : "records"
                                } in
                                ${element.description.ingestResult.numBlocks} new ${
                                    element.description.ingestResult.numBlocks == 1 ? "block" : "blocks"
                                }`;

                            case "FlowDescriptionDatasetExecuteTransform":
                                if (_.isNil(element.description.transformResult)) {
                                    throw new Error("Expected to have transform result");
                                }
                                return `Transformed ${element.description.transformResult.numRecords} new ${
                                    element.description.transformResult.numRecords == 1 ? "record" : "records"
                                } in
                                ${element.description.transformResult.numBlocks} new ${
                                    element.description.transformResult.numBlocks == 1 ? "block" : "blocks"
                                }`;

                            // TODO
                            //  - Compacting
                            //  - GC
                        }
                        break;

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
                }

                break;

            case FlowStatus.Waiting:
            case FlowStatus.Queued:
            case FlowStatus.Running:
            case FlowStatus.Scheduled:
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

                    // TODO: consider what to display for other flow types
                    //  - push ingest
                    //  - transform
                    //  - compacting
                    //  - GC
                }
        }

        return "";
    }
}
