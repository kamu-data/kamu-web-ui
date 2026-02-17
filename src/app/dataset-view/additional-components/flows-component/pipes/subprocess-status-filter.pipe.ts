/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";

import { FlowProcessEffectiveState, WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";

@Pipe({
    name: "subprocessStatusFilter",
    standalone: true,
})
export class SubprocessStatusFilterPipe implements PipeTransform {
    public transform(
        subprocesses: WebhookFlowSubProcess[],
        filter: FlowProcessEffectiveState[],
    ): WebhookFlowSubProcess[] {
        if (!filter.length) return subprocesses;

        return subprocesses.filter((item) => filter.includes(item.summary.effectiveState));
    }
}
