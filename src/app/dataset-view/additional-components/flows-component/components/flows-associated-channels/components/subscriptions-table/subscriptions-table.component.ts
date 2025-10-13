/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
} from "@angular/core";
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
import { DatasetFlowsTabState, FlowsSelectionState, webhooksStateMapper } from "../../../../flows.helpers";
import { FlowProcessEffectiveState, WebhookFlowSubProcess } from "src/app/api/kamu.graphql.interface";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { take } from "rxjs";
import AppValues from "src/app/common/values/app.values";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-subscriptions-table",
    standalone: true,
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsTableComponent {
    @Input({ required: true }) public flowConnectionData: DatasetFlowsTabState;
    @Input({ required: true }) public flowsSelectionState: FlowsSelectionState;
    @Input({ required: true }) public flowsData: DatasetOverviewTabData;
    @Output() public refreshEmitter: EventEmitter<void> = new EventEmitter<void>();

    private navigationService = inject(NavigationService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private cdr = inject(ChangeDetectorRef);

    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly SUBSCRIPTIONS_DISPLAY_COLUMNS: string[] = [
        "subscription",
        "status",
        "consecutive_failures",
        "options",
    ];

    public refreshFlow() {
        this.refreshEmitter.emit();
    }

    public navigateToSubscription(process: WebhookFlowSubProcess): void {
        if (this.flowsSelectionState.webhooksCategory || this.flowsSelectionState.flowsCategory) {
            this.flowsSelectionState.webhooksIds = [];
        }
        if (!this.flowsSelectionState.subscriptions.includes(process.name)) {
            this.flowsSelectionState.subscriptions.push(process.name);
            this.flowsSelectionState.webhooksIds.push(process.id);
        }
        this.flowsSelectionState.webhookFilterButtons = [];
        this.flowsSelectionState.webhooksCategory = undefined;

        this.navigationService.navigateToDatasetView({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: this.flowsSelectionState.webhooksIds,
        });
        this.refreshFlow();
    }

    public pauseWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookPauseSubscription(this.flowsData.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
                }
            });
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.flowsData.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    setTimeout(() => {
                        this.refreshFlow();
                        this.cdr.detectChanges();
                    }, AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
                }
            });
    }

    public navigateToWebhookSettings(subscriptionId: string): void {
        this.flowsSelectionState.webhookFilterButtons = [];
        this.flowsSelectionState.webhooksIds = [];
        this.navigationService.navigateToWebhooks({
            accountName: this.flowsData.datasetBasics.owner.accountName,
            datasetName: this.flowsData.datasetBasics.name,
            tab: subscriptionId,
        });
    }

    public webhooksStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public trackBySubscriptionId(index: number, item: WebhookFlowSubProcess): string {
        return item.id;
    }
}
