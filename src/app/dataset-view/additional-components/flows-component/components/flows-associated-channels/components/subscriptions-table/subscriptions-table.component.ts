/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import {
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    WebhookFlowSubProcessDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { webhooksStateMapper } from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { SubprocessStatusFilterPipe } from "src/app/dataset-view/additional-components/flows-component/pipes/subprocess-status-filter.pipe";

@Component({
    selector: "app-subscriptions-table",
    imports: [
        //-----//
        MatIconModule,
        MatTableModule,
        //-----//
        SubprocessStatusFilterPipe,
    ],
    templateUrl: "./subscriptions-table.component.html",
    styleUrls: ["./subscriptions-table.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsTableComponent {
    @Input({ required: true }) public subprocesses: WebhookFlowSubProcessDataFragment[];
    @Input({ required: true }) public webhookTableFilters: FlowProcessEffectiveState[];
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    /** Subscriptions whose pause or resume has not shown its result yet */
    @Input() public busySubscriptionIds: MaybeNull<ReadonlySet<string>> = null;
    @Output() public webhookSettingsClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public subscriptionClicked: EventEmitter<WebhookFlowSubProcessDataFragment> =
        new EventEmitter<WebhookFlowSubProcessDataFragment>();
    @Output() public pauseWebhookClicked: EventEmitter<string> = new EventEmitter<string>();
    @Output() public resumeWebhookClicked: EventEmitter<string> = new EventEmitter<string>();

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

    public navigateToSubscription(process: WebhookFlowSubProcessDataFragment): void {
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

    public trackBySubscriptionId(index: number, item: WebhookFlowSubProcessDataFragment): string {
        return item.id;
    }
}
