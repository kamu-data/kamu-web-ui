/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { FlowsSelectionState, WebhooksFiltersOptions, WebhooksSelectedCategory } from "../../flows.helpers";
import {
    FlowProcessEffectiveState,
    WebhookFlowSubProcess,
    WebhookFlowSubProcessGroup,
} from "src/app/api/kamu.graphql.interface";
import { SubscriptionsTableComponent } from "./components/subscriptions-table/subscriptions-table.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeUndefined } from "src/app/interface/app.types";
@Component({
    selector: "app-flows-associated-channels",
    standalone: true,
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

    public readonly WEBHOOKS_FILTERS_OPTIONS = WebhooksFiltersOptions;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

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
