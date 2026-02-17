/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowItemWidgetDataFragment, FlowStatus } from "@api/kamu.graphql.interface";

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
            case FlowStatus.Retrying: {
                return "retrying-class";
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
