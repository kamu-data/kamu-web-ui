import { FlowOutcome, FlowStatus, FlowSummaryDataFragment } from "src/app/api/kamu.graphql.interface";

export class TileBaseWidgetHelpers {
    public static tileWidgetClass(node: FlowSummaryDataFragment): string {
        switch (node.status) {
            case FlowStatus.Finished: {
                return node.outcome ? flowOutcomeMapperClass[node.outcome] : "";
            }
            case FlowStatus.Running: {
                return "running-class";
            }
            case FlowStatus.Waiting: {
                return "waiting-class";
            }
            default:
                return "";
        }
    }
}

const flowOutcomeMapperClass: Record<FlowOutcome, string> = {
    [FlowOutcome.Success]: "success-class",
    [FlowOutcome.Failed]: "failed-class",
    [FlowOutcome.Aborted]: "aborted-class",
};
