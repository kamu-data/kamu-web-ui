/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";

import { SubscriptionsTableComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-associated-channels/components/subscriptions-table/subscriptions-table.component";
import {
    FlowsSelectionState,
    RollupFiltersOptions,
    WebhooksSelectedCategory,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";

import {
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    WebhookFlowSubProcess,
    WebhookFlowSubProcessGroup,
} from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

@Component({
    selector: "app-flows-associated-channels",
    imports: [
        //-----//
        FormsModule,
        NgClass,
        NgIf,
        NgFor,
        //-----//
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatChipsModule,
        //-----//
        SubscriptionsTableComponent,
    ],
    templateUrl: "./flows-associated-channels.component.html",
    styleUrls: ["./flows-associated-channels.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowsAssociatedChannelsComponent {
    @Input({ required: true }) public flowsSelectionState: FlowsSelectionState;
    @Input({ required: true }) public webhooksData: WebhookFlowSubProcessGroup;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public webhookSettingsClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public subcriptionClicked: EventEmitter<WebhookFlowSubProcess> =
        new EventEmitter<WebhookFlowSubProcess>();
    @Output() public pauseWebhookClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public resumeWebhookClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public selectionWebhooksClicked: EventEmitter<MaybeUndefined<WebhooksSelectedCategory>> =
        new EventEmitter<MaybeUndefined<WebhooksSelectedCategory>>();
    @Output() public toggleWebhookFilterClicked: EventEmitter<FlowProcessEffectiveState[]> = new EventEmitter<
        FlowProcessEffectiveState[]
    >();
    @Output() public removeSelectedWebhookClicked: EventEmitter<string> = new EventEmitter<string>();

    public readonly WEBHOOKS_FILTERS_OPTIONS = RollupFiltersOptions;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;

    public get showSubprocessesTable(): boolean {
        return this.isWebhookCategoryActive || Boolean(this.flowsSelectionState.webhooksIds.length);
    }

    public get isWebhookCategoryActive(): boolean {
        return this.flowsSelectionState.webhooksCategory === "webhooks";
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
        this.webhookSettingsClicked.emit(subscriptionId);
    }

    public navigateToSubscription(process: WebhookFlowSubProcess): void {
        this.subcriptionClicked.emit(process);
    }

    public pauseWebhook(subscriptionId: string): void {
        this.pauseWebhookClicked.emit(subscriptionId);
    }

    public resumeWebhook(subscriptionId: string): void {
        this.resumeWebhookClicked.emit(subscriptionId);
    }

    public onSelectionWebhooksChange(event: MatChipListboxChange): void {
        this.selectionWebhooksClicked.emit(event.value as MaybeUndefined<WebhooksSelectedCategory>);
    }

    public onToggleWebhookFilter(event: MatButtonToggleChange): void {
        this.toggleWebhookFilterClicked.emit(event.value as FlowProcessEffectiveState[]);
    }

    public removeSelectedWebhook(subscriptionName: string): void {
        this.removeSelectedWebhookClicked.emit(subscriptionName);
    }
}
