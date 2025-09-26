/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Pipe, PipeTransform } from "@angular/core";
import { FlowProcessEffectiveState, WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { MaybeNull } from "src/app/interface/app.types";

@Pipe({
    name: "subprocessStatusFilter",
    standalone: true,
})
export class SubprocessStatusFilterPipe implements PipeTransform {
    public transform(
        subprocesses: WebhookFlowSubProcess[],
        filter: MaybeNull<FlowProcessEffectiveState>,
    ): WebhookFlowSubProcess[] {
        if (!filter) return subprocesses;
        return subprocesses.filter((item) => item.summary.effectiveState === filter);
    }
}
