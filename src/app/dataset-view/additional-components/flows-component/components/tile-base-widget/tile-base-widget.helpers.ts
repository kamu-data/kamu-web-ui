import { FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

export class TileBaseWidgetHelpers {
    public static tileWidgetClass(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Finished: {
                return node.outcome ? flowOutcomeMapperClass[node.outcome] : "";
            }
            case FlowStatus.Queued: {
                return "queued";
            }
            case FlowStatus.Running: {
                return "running";
            }
            case FlowStatus.Waiting: {
                return "waiting";
            }
            case FlowStatus.Scheduled: {
                return "scheduled";
            }
            default:
                return "";
        }
    }
}

const flowOutcomeMapperClass: Record<FlowOutcome, string> = {
    [FlowOutcome.Success]: "success",
    [FlowOutcome.Failed]: "failed",
    [FlowOutcome.Aborted]: "aborted",
    [FlowOutcome.Cancelled]: "cancelled",
};
