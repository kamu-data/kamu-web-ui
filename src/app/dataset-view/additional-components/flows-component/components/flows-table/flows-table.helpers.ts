import moment from "moment";
import { FetchStep, FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/app.values";

export class DatasetFlowTableHelpers {
    public static descriptionColumnTableOptions(element: FlowSummaryDataFragment): { icon: string; class: string } {
        if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Success) {
            return { icon: "check_circle", class: "completed-status" };
        } else if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Failed) {
            return { icon: "dangerous", class: "failed-status" };
        } else if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Aborted) {
            return { icon: "cancel", class: "aborted-outcome" };
        } else if (element.status === FlowStatus.Queued) {
            return { icon: "radio_button_checked", class: "queued-status" };
        } else if (element.status === FlowStatus.Running) {
            return { icon: "radio_button_checked", class: "running-status" };
        } else if (element.status === FlowStatus.Scheduled) {
            return { icon: "radio_button_checked", class: "scheduled-status" };
        }
        return { icon: "question_mark", class: "" };
    }

    public static descriptionEndOfMessage(element: FlowSummaryDataFragment): string {
        if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Success) {
            return "finished";
        } else if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Failed) {
            return "failed";
        } else if (element.status === FlowStatus.Finished && element.outcome === FlowOutcome.Aborted) {
            return "aborted";
        } else if (element.status === FlowStatus.Queued) {
            return "queued";
        } else if (element.status === FlowStatus.Running) {
            return "running";
        } else if (element.status === FlowStatus.Scheduled) {
            return "scheduled";
        } else if (element.status === FlowStatus.Waiting) {
            return "waiting";
        }
        return "unknown status";
    }

    public static descriptionSubMessage(element: FlowSummaryDataFragment, fetchStep: FetchStep): string {
        if (
            (element.description.__typename === "FlowDescriptionDatasetPollingIngest" ||
                element.description.__typename === "FlowDescriptionDatasetPushIngest") &&
            element.description.ingestResult
        ) {
            return `Ingested ${element.description.ingestResult.numRecords} new ${
                element.description.ingestResult.numRecords > 1 ? "records" : "record"
            } and
            ${element.description.ingestResult.numBlocks} new ${
                element.description.ingestResult.numBlocks > 1 ? "blocks" : "block"
            }`;
        } else if (
            element.description.__typename === "FlowDescriptionDatasetExecuteTransform" &&
            element.description.transformResult
        ) {
            `Transformed ${element.description.transformResult.numRecords} new ${
                element.description.transformResult.numRecords > 1 ? "records" : "record"
            } and
            ${element.description.transformResult.numBlocks} new ${
                element.description.transformResult.numBlocks > 1 ? "blocks" : "block"
            }`;
        } else if (element.status === FlowStatus.Queued && fetchStep.__typename === "FetchStepUrl") {
            return `Polling data from url: ${fetchStep.url}`;
        } else if (element.status === FlowStatus.Queued && fetchStep.__typename === "FetchStepContainer") {
            return `Polling data from image: ${fetchStep.image}`;
        } else if (element.status === FlowStatus.Queued && fetchStep.__typename === "FetchStepFilesGlob") {
            return `Polling data from file: ${fetchStep.path}`;
        } else if (element.outcome === FlowOutcome.Aborted) {
            return `Aborted at ${moment(element.timing.finishedAt).format(AppValues.CRON_EXPRESSION_DATE_FORMAT)}`;
        } else if (element.outcome === FlowOutcome.Failed) {
            return `An error occurred, see logs for more details`;
        }
        return "";
    }
}
