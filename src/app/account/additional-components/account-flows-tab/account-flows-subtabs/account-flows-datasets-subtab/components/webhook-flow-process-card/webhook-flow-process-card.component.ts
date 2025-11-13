/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import {
    DatasetBasicsFragment,
    DatasetKind,
    FlowProcessEffectiveState,
    FlowProcessSummary,
} from "src/app/api/kamu.graphql.interface";
import AppValues from "src/app/common/values/app.values";
import {
    DatasetFlowsBadgeStyle,
    DatasetFlowBadgeHelpers,
    DatasetFlowsBadgeTexts,
    webhooksStateMapper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

@Component({
    selector: "app-webhook-flow-process-card",
    standalone: true,
    imports: [
        //-----//
        NgIf,
        NgClass,
        RouterLink,

        //-----//
        MatIconModule,

        //-----//
        DatePipe,
    ],
    templateUrl: "./webhook-flow-process-card.component.html",
    styleUrls: ["./webhook-flow-process-card.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebhookFlowProcessCardComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public summary: FlowProcessSummary;
    @Input({ required: true }) public subscriptionId: string;

    @Output() public toggleWebhookCardStateEmitter = new EventEmitter<{
        datasetBasics: DatasetBasicsFragment;
        state: FlowProcessEffectiveState;
        subscriptionId: string;
    }>();
    @Output() public editWebhookCardEmitter = new EventEmitter<{
        datasetBasics: DatasetBasicsFragment;
        subscriptionId: string;
    }>();

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    public badgeStyles(effectiveState: FlowProcessEffectiveState): DatasetFlowsBadgeStyle {
        return DatasetFlowBadgeHelpers.badgeStyles(effectiveState);
    }

    public badgeMessages(dataset: DatasetBasicsFragment, summary: FlowProcessSummary): DatasetFlowsBadgeTexts {
        const isRoot = dataset.kind === DatasetKind.Root;
        return DatasetFlowBadgeHelpers.badgeMessages(summary, isRoot);
    }

    public flowProcessEffectiveStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public toggleWebhookCardState(
        datasetBasics: DatasetBasicsFragment,
        subscriptionId: string,
        state: FlowProcessEffectiveState,
    ): void {
        this.toggleWebhookCardStateEmitter.emit({ datasetBasics, subscriptionId, state });
    }

    public editWebhookCard(datasetBasics: DatasetBasicsFragment, subscriptionId: string): void {
        this.editWebhookCardEmitter.emit({ datasetBasics, subscriptionId });
    }
}
