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
} from "@api/kamu.graphql.interface";
import { DataHelpers } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import {
    DatasetFlowBadgeHelpers,
    DatasetFlowsBadgeStyle,
    DatasetFlowsBadgeTexts,
    webhooksStateMapper,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-webhook-flow-process-card",
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
    @Input({ required: true }) public subscriptionName: string;

    @Output() public toggleWebhookCardStateEmitter = new EventEmitter<{
        datasetBasics: DatasetBasicsFragment;
        state: FlowProcessEffectiveState;
        subscriptionId: string;
    }>();

    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;

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

    public durationProcessRunning(startProcessTime: string): string {
        return DataHelpers.durationTask(startProcessTime, new Date().toISOString());
    }

    public toggleWebhookCardState(
        datasetBasics: DatasetBasicsFragment,
        subscriptionId: string,
        state: FlowProcessEffectiveState,
    ): void {
        this.toggleWebhookCardStateEmitter.emit({ datasetBasics, subscriptionId, state });
    }
}
