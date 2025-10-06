/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";
import { WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { FlowProcessEffectiveCustomState } from "src/app/dataset-view/dataset-view.interface";

@Pipe({
    name: "subprocessStatusFilter",
    standalone: true,
})
export class SubprocessStatusFilterPipe implements PipeTransform {
    public transform(
        subprocesses: WebhookFlowSubProcess[],
        filter: FlowProcessEffectiveCustomState[],
        webhookIds: string[],
    ): WebhookFlowSubProcess[] {
        if (webhookIds.length) {
            return subprocesses.filter((item) => webhookIds.includes(item.id));
        }
        if (!filter.length || filter.includes("")) return subprocesses;

        return subprocesses.filter((item) => filter.includes(item.summary.effectiveState));
    }
}
