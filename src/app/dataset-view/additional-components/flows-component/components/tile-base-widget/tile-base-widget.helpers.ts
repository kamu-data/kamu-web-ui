import { FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

export class TileBaseWidgetHelpers {
    public static tileWidgetClass(node: FlowSummaryDataFragment): string {
        if (node.status === FlowStatus.Finished && node.outcome === FlowOutcome.Success) {
            return "completed";
        } else if (node.status === FlowStatus.Finished && node.outcome === FlowOutcome.Failed) {
            return "failed";
        } else if (node.status === FlowStatus.Finished && node.outcome === FlowOutcome.Aborted) {
            return "aborted";
        } else if (node.status === FlowStatus.Queued) {
            return "queued";
        } else if (node.status === FlowStatus.Running) {
            return "running";
        } else if (node.status === FlowStatus.Waiting) {
            return "waiting";
        } else if (node.status === FlowStatus.Scheduled) {
            return "scheduled";
        }
        return "";
    }
}
