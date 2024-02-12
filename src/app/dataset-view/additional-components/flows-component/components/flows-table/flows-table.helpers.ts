import { FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

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
            return "updated";
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
}
