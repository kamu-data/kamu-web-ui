import { FlowItemWidgetDataFragment, FlowStatus } from "src/app/api/kamu.graphql.interface";

export class TileBaseWidgetHelpers {
    public static tileWidgetClass(node: FlowItemWidgetDataFragment): string {
        switch (node.status) {
            case FlowStatus.Finished: {
                return node.outcome ? flowOutcomeMapperClass[node.outcome.__typename as string] : "";
            }
            case FlowStatus.Running: {
                return "running-class";
            }
            case FlowStatus.Waiting: {
                return "waiting-class";
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unknown flow status");
        }
    }
}

const flowOutcomeMapperClass: Record<string, string> = {
    FlowSuccessResult: "success-class",
    FlowFailedError: "failed-class",
    FlowAbortedResult: "aborted-class",
};
