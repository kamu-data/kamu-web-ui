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
    ): WebhookFlowSubProcess[] {
        if (!filter.length || filter.includes("total")) return subprocesses;

        return subprocesses.filter((item) => filter.includes(item.summary.effectiveState));
    }
}
