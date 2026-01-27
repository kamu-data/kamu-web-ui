/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTableModule } from "@angular/material/table";
import { SubprocessStatusFilterPipe } from "../../../../pipes/subprocess-status-filter.pipe";
import { webhooksStateMapper } from "../../../../flows.helpers";
import {
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    WebhookFlowSubProcess,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-subscriptions-table",
    imports: [
        //-----//
        FormsModule,
        NgIf,
        //-----//
        MatMenuModule,
        MatIconModule,
        MatTableModule,
        MatDividerModule,
        MatProgressBarModule,
        MatButtonToggleModule,
        MatChipsModule,
        //-----//
        SubprocessStatusFilterPipe,
    ],
    templateUrl: "./subscriptions-table.component.html",
    styleUrls: ["./subscriptions-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsTableComponent {
    @Input({ required: true }) public subprocesses: WebhookFlowSubProcess[];
    @Input({ required: true }) public webhookTableFilters: FlowProcessEffectiveState[];
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public webhookSettingsClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public subscriptionClicked: EventEmitter<WebhookFlowSubProcess> =
        new EventEmitter<WebhookFlowSubProcess>();
    @Output() public pauseWebhookClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public resumeWebhookClicked: EventEmitter<string> = new EventEmitter<string>();

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

    public navigateToSubscription(process: WebhookFlowSubProcess): void {
        this.subscriptionClicked.emit(process);
    }

    public pauseWebhook(subscriptionId: string): void {
        this.pauseWebhookClicked.emit(subscriptionId);
    }

    public resumeWebhook(subscriptionId: string): void {
        this.resumeWebhookClicked.emit(subscriptionId);
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
        this.webhookSettingsClicked.emit(subscriptionId);
    }

    public webhooksStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public trackBySubscriptionId(index: number, item: WebhookFlowSubProcess): string {
        return item.id;
    }
}
